import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SupabaseService } from 'src/Database/database.service';

type ReceiptInput = {
  clientId?: string;
  store?: string;
  amountPaid?: number;
  date?: string;
  items?: { name: string; quantity: string }[];
};

@Injectable()
export class ShoppingRecordsService {
  private readonly logger = new Logger(ShoppingRecordsService.name);
  private readonly bucket = 'fitfuel-receipts';
  private bucketReady?: Promise<void>;

  constructor(private readonly database: SupabaseService) {}

  private ensureBucket(): Promise<void> {
    if (!this.bucketReady) {
      this.bucketReady = (async () => {
        const storage = this.database.getClient().storage;
        const { data, error } = await storage.listBuckets();
        if (error) throw error;
        if (!data.some((bucket) => bucket.name === this.bucket)) {
          const created = await storage.createBucket(this.bucket, { public: false, fileSizeLimit: 65536, allowedMimeTypes: ['application/json'] });
          if (created.error) throw created.error;
        }
      })().catch((error: unknown) => {
        this.bucketReady = undefined;
        this.logger.error(`Receipt storage unavailable: ${error instanceof Error ? error.message : 'unknown error'}`);
        throw new ServiceUnavailableException('Receipt storage is unavailable. Please try again.');
      });
    }
    return this.bucketReady;
  }

  async save(userId: string, input: ReceiptInput) {
    const clientId = input.clientId || randomUUID();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientId)) throw new BadRequestException('Invalid receipt ID.');
    const store = input.store?.trim();
    if (!store || store.length > 60) throw new BadRequestException('Choose a store.');
    if (typeof input.amountPaid !== 'number' || !Number.isFinite(input.amountPaid) || input.amountPaid <= 0 || input.amountPaid > 10000) throw new BadRequestException('Enter a receipt amount between $0.01 and $10,000.');
    if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 100 || input.items.some((item) => !item || typeof item.name !== 'string' || !item.name.trim() || item.name.length > 150 || typeof item.quantity !== 'string' || item.quantity.length > 100)) throw new BadRequestException('A receipt note needs at least one valid food item.');
    const date = input.date && !Number.isNaN(Date.parse(input.date)) && new Date(input.date).getTime() <= Date.now() ? new Date(input.date).toISOString() : new Date().toISOString();
    const record = { id: clientId, kind: 'self-reported', date, store, amountPaid: Math.round(input.amountPaid * 100) / 100, items: input.items.map((item) => ({ name: item.name.trim(), quantity: item.quantity.trim() })) };
    await this.ensureBucket();
    const path = `${userId}/${clientId}.json`;
    const storage = this.database.getClient().storage.from(this.bucket);
    const { error } = await storage.upload(path, Buffer.from(JSON.stringify(record)), { contentType: 'application/json', upsert: false });
    if (error) {
      const existing = await storage.download(path);
      if (!existing.error && existing.data) return JSON.parse(await existing.data.text());
      this.logger.error(`Could not store receipt note: ${error.message}`);
      throw new ServiceUnavailableException('Could not save your receipt note. Please try again.');
    }
    return record;
  }

  async list(userId: string) {
    await this.ensureBucket();
    const storage = this.database.getClient().storage.from(this.bucket);
    const { data, error } = await storage.list(userId, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) throw new ServiceUnavailableException('Could not load saved receipt notes.');
    const files = (data || []).filter((file) => file.name.endsWith('.json'));
    const records = await Promise.all(files.map(async (file) => {
      const result = await storage.download(`${userId}/${file.name}`);
      if (result.error || !result.data) return null;
      try { return JSON.parse(await result.data.text()) as Record<string, unknown>; } catch { return null; }
    }));
    return records.filter((record): record is Record<string, unknown> => record !== null).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }
}
