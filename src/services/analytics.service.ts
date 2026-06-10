import prisma from  '../config/db';

export async function getAnalytic(slug: string){

    const url = await prisma.url.findUnique({
        where : { slug },
    })

    if(!url) {
        return null;
    }

    const [totalClicks, grpCountry, grpDevice, recentClicks] = await Promise.all([
        prisma.click.count({
        where : { urlId: url.id },
    }),

    prisma.click.groupBy({
        by: ['country'],
        where: { urlId: url.id },
        _count: {
            country: true,
        },
        orderBy: {
            _count: {
                country: 'desc',
            }
        },
    }),

    prisma.click.groupBy({
        by: ['userAgent'],
        where: { urlId: url.id },
        _count: {
            userAgent: true,
        },
        orderBy: {
            _count: {
                userAgent: 'desc',
            }
        },
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

    return {
        slug,
        longUrl: url.longUrl,
        totalClicks,
        grpCountry: grpCountry.map(item => ({ country: item.country, count: item._count.country })),
        grpDevice: grpDevice.map(item => ({ Device: item.userAgent, count: item._count.userAgent })),
        recentClicks,
    }
}