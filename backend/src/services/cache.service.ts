import redis from '../config/redis'

const CACHE_TTL = 60 * 60 * 24; // 24 hrs

export interface CachedUrlData {
  longUrl: string
  urlId: number
  expiresAt?: Date | string | null
}

export async function getCachedUrl(slug: string): Promise<CachedUrlData | null> {
    try {
        const cachedUrl = await redis.get(`url:${slug}`);
        if (!cachedUrl) return null;
        return JSON.parse(cachedUrl) as CachedUrlData;
    } catch {
        return null;
    }
}

export async function setCachedUrl(slug: string, data: CachedUrlData): Promise<void> {
    try {
        await redis.set(`url:${slug}`, JSON.stringify(data), 'EX', CACHE_TTL);
    } catch {
        // Redis unavailable — cache miss on next request, no data loss
    }
}

export async function deleteCachedUrl(slug: string): Promise<void> {
    try {
        await redis.del(`url:${slug}`);
    } catch {
        // Best-effort cache eviction
    }
}

export async function deleteAnalyticsCache(slug: string): Promise<void> {
    try {
        await redis.del(`analytics:${slug}`);
    } catch {
        // Best-effort cache eviction
    }
}
