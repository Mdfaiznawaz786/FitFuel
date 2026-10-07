import { BadRequestException, Injectable, Logger } from '@nestjs/common';

type Estimate = {
  name: string;
  low: number | null;
  high: number | null;
  matches: number;
  sourceUrl: string;
};

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);
  private readonly cache = new Map<string, { time: number; value: Estimate }>();

  async estimate(body: { names?: unknown }): Promise<{ source: string; checkedAt: string; items: Estimate[] }> {
    if (!Array.isArray(body?.names) || body.names.length > 30 || body.names.some((name) => typeof name !== 'string' || !name.trim() || name.length > 100)) {
      throw new BadRequestException('Send up to 30 food names, each under 100 characters.');
    }
    const unique = [...new Set((body.names as string[]).map((name) => name.trim()))];
    const items: Estimate[] = [];
    for (let index = 0; index < unique.length; index += 5) {
      items.push(...await Promise.all(unique.slice(index, index + 5).map((name) => this.estimateOne(name))));
    }
    return { source: 'Kroger public online listings', checkedAt: new Date().toISOString(), items };
  }

  private async estimateOne(name: string): Promise<Estimate> {
    const sourceUrl = `https://www.kroger.com/search?query=${encodeURIComponent(name)}`;
    const fallback: Estimate = { name, low: null, high: null, matches: 0, sourceUrl };
    const key = name.toLowerCase();
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.time < 30 * 60_000) return cached.value;
    try {
      const response = await fetch(sourceUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FitFuelPriceEstimate/1.0)' },
        signal: AbortSignal.timeout(9000),
      });
      if (!response.ok) return fallback;
      const html = await response.text();
      const products = [...html.matchAll(/data-testid="product-card-\d+" aria-label="([^"]+)"/g)].slice(0, 20);
      const tokens = this.tokens(name);
      if (!tokens.length) return fallback;
      const candidates: { price: number; score: number }[] = [];
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        const title = product[1].replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&');
        const productTokens = this.tokens(title);
        const score = tokens.filter((token) => productTokens.includes(token)).length / tokens.length;
        if (score < 0.6) continue;
        const end = products[index + 1]?.index ?? html.length;
        const card = html.slice(product.index, end);
        const price = card.match(/class="citrus-Price--current-price[^"]*">\s*\$([\d,.]+)/)?.[1];
        const value = price ? Number(price.replace(/,/g, '')) : NaN;
        if (Number.isFinite(value) && value >= 0.25 && value <= 200) candidates.push({ price: value, score });
      }
      const bestScore = Math.max(...candidates.map((candidate) => candidate.score));
      const prices = candidates.filter((candidate) => candidate.score === bestScore).slice(0, 5).map((candidate) => candidate.price);
      const value: Estimate = prices.length ? { name, low: Math.min(...prices), high: Math.max(...prices), matches: prices.length, sourceUrl } : fallback;
      this.cache.set(key, { time: Date.now(), value });
      return value;
    } catch (error) {
      this.logger.warn(`Price lookup unavailable for a food search: ${error instanceof Error ? error.name : 'unknown'}`);
      return fallback;
    }
  }

  private tokens(value: string): string[] {
    const words = value.toLowerCase().match(/[a-z]{3,}/g) ?? [];
    const stop = new Set(['with', 'and', 'the', 'fresh', 'cooked', 'serving', 'organic', 'scrambled', 'boiled', 'grilled', 'baked']);
    return words.filter((word) => !stop.has(word)).map((word) => word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word);
  }
}
