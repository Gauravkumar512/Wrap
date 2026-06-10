import redis from '../config/redis'

const CACHE_TTL = 60 * 60 * 24; // 24 hrs

export async function getCachedUrl(slug: string): Promise<string | null> {
    const cachedUrl = await redis.get(`url:${slug}`);
    return cachedUrl;
}

export async function setCachedUrl(slug: string, longUrl: string): Promise<void> {
    await redis.set(`url:${slug}`, longUrl , 'EX', CACHE_TTL);
}

export async function deleteCachedUrl(slug: string): Promise<void> {
    await redis.del(`url:${slug}`);
}