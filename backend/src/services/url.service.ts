import prisma from "../config/db";
import { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import { ShortenRequest } from "../types";
import { setCachedUrl, deleteCachedUrl, deleteAnalyticsCache } from "./cache.service";

export async function createShortUrl(data: ShortenRequest): Promise<string> {
    
    let retries = 0;
    let maxRetries = 3;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Set expiration to 30 days from now
    
    while(retries < maxRetries) {
        const generatedSlug = nanoid(6);

        try {
        const url = await prisma.url.create({
        data : {
            slug: generatedSlug,
            longUrl: data.longUrl,
            clerkUserId: data.clerkUserId ?? null,
            expiresAT: expiresAt,
    }})

        await setCachedUrl(generatedSlug, { longUrl: data.longUrl, urlId: url.id, expiresAt: expiresAt });

        return generatedSlug;
    }
        catch (error){
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                retries++;
                continue;
            }
            throw error;
        } 
    }
    
    throw new Error("Failed to generate a unique slug after multiple attempts.");
}

export async function getUrlBySlug(slug: string) {
    const url = await prisma.url.findUnique({
        where: { slug },
    });

    return url;
}

export async function getUserLinks(clerkUserId: string) {
    const urls = await prisma.url.findMany({
        where: { clerkUserId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { clicks: true } },
        },
    });

    return urls.map(url => ({
        id: url.id,
        slug: url.slug,
        longUrl: url.longUrl,
        createdAt: url.createdAt.toISOString(),
        totalClicks: url._count.clicks,
        expiresAt: url.expiresAT.toISOString(),
    }));
}

export async function deleteLink(slug: string, clerkUserId: string): Promise<void> {
    const url = await prisma.url.findUnique({ where: { slug } });
    if (!url) throw new Error('Link not found');
    if (url.clerkUserId !== clerkUserId) throw new Error('Unauthorized');

    await Promise.all([
        deleteCachedUrl(slug),
        deleteAnalyticsCache(slug),
    ]);

    await prisma.url.delete({ where: { slug } });
}