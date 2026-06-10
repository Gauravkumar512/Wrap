import redis from '../config/redis'

const CACHE_TTL = 60 * 60 * 24; // 24 hrs

export interface CachedUrlData {
  longUrl: string
  urlId: number
}

export async function getCachedUrl(slug: string): Promise<CachedUrlData | null> {
    const cachedUrl = await redis.get(`url:${slug}`);
    if(!cachedUrl) {
        return null;
    }
    return JSON.parse(cachedUrl) as CachedUrlData;
}

export async function setCachedUrl(slug: string, data: CachedUrlData): Promise<void> {
    await redis.set(`url:${slug}`, JSON.stringify(data), 'EX', CACHE_TTL);
}

export async function deleteCachedUrl(slug: string): Promise<void> {
    await redis.del(`url:${slug}`);
}