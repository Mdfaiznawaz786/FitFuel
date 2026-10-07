import { Injectable, OnModuleInit, Logger, ServiceUnavailableException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient | null = null;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const secretKey = this.configService.get<string>('SUPABASE_SECRET_KEY');
    if (!url || !secretKey) {
      this.logger.warn('Set SUPABASE_URL and SUPABASE_SECRET_KEY to enable database features');
      return;
    }
    this.supabase = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async onModuleInit() {
    if (!this.supabase) return;
    try {
      const { error } = await this.supabase
        .from('users')
        .select('id')
        .limit(1);
      if (error) throw error;

      this.logger.log('Database connection is created successfully');
    } catch (error) {
      this.logger.error('Database connection failed:', error);
      // Depending on your application requirements, you might want to:
      // 1. Retry the connection
      // 2. Exit the application
      // 3. Continue but with limited functionality
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new ServiceUnavailableException('Database is not configured');
    }
    return this.supabase;
  }
}
