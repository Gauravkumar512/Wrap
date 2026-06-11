import prisma from "../config/db";
import { nanoid } from "nanoid";
import { ShortenRequest } from "../types";
import { setCachedUrl } from "./cache.service";

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
            userId: data.userId ?? null,
            expiresAT: expiresAt,
    }})

        await setCachedUrl(generatedSlug, { longUrl: data.longUrl, urlId: url.id });

        return generatedSlug;
    }
        catch (error: any){
            if(error.code === 'P2002'){
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