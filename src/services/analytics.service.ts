import prisma from  '../config/db';
import redis from '../config/redis';

const ANALYTICS_CACHE_TTL = 30;

export async function getAnalytic(slug: string, clerkUserId: string) {

    const cacheKey = `analytics:${slug}`;
    const cached = await redis.get(cacheKey);

    if(cached) {
        const parsed = JSON.parse(cached);
        if(parsed.clerkUserId !== clerkUserId) return 'forbidden';
        return parsed;
    }

    const url = await prisma.url.findUnique({
        where : { slug },
    })

    if(!url) return null;

    if(url.clerkUserId !== clerkUserId) return 'forbidden';

    const [totalClicks, grpCountry, grpDevice, recentClicks] = await Promise.all([
        prisma.click.count({
            where : { urlId: url.id },
        }),

        prisma.click.groupBy({
            by: ['country'],
            where: { urlId: url.id },
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
        }),

        prisma.click.groupBy({
            by: ['userAgent'],
            where: { urlId: url.id },
            _count: { userAgent: true },
            orderBy: { _count: { userAgent: 'desc' } },
        }),

        prisma.click.findMany({
            where: { urlId: url.id },
            orderBy: { clickedAt: 'desc' },
            take: 10,
            select: {
                clickedAt: true,
                ipAddress: true,
                country: true,
                userAgent: true,
                referrer: true,
            },
        }),
    ])

    const result = {
        clerkUserId,
        slug,
        longUrl: url.longUrl,
        totalClicks,
        clicksByCountry: grpCountry.map(item => ({ country: item.country, count: item._count.country })),
        clicksByDevice: grpDevice.map(item => ({ device: item.userAgent, count: item._count.userAgent })),
        recentClicks,
    }

    await redis.set(cacheKey, JSON.stringify(result), 'EX', ANALYTICS_CACHE_TTL);

    return result;
}
