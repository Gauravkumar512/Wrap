import { Request,Response } from 'express';
import { createShortUrl } from '../services/url.service';
import { z } from 'zod';

const ShortenSchema = z.object({
    longUrl: z.string().url("Invalid URL format"),
    userId: z.number().optional()
})

export async function handleShorten(req: Request, res: Response) {
    try {
        const validation = ShortenSchema.safeParse(req.body);
        
        if (!validation.success){
            return res.status(400).json({ message: 'Invalid request data', errors: validation.error.issues });
        };
        
        const { longUrl, userId } = validation.data;

        const slug = await createShortUrl({ longUrl, userId });
        
        res.status(201).json({
            message: 'Short URL created successfully',
            shortUrl: `${req.protocol}://${req.get('host')}/${slug}`,
            slug: slug
        })

    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}