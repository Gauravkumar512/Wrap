import { Request, Response, NextFunction } from 'express';
import { ExpressRequestWithAuth } from '@clerk/express';
import { createShortUrl } from '../services/url.service';
import { ShortenSchema } from '../schemas/shorten.schema';

export async function handleShorten(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const validation = ShortenSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ message: 'Invalid request data', errors: validation.error.issues });
            return;
        }

        const { longUrl } = validation.data;
        const { userId: clerkUserId } = (req as ExpressRequestWithAuth).auth();

        const slug = await createShortUrl({ longUrl, clerkUserId: clerkUserId ?? undefined });

        res.status(201).json({
            message: 'Short URL created successfully',
            shortUrl: `${req.protocol}://${req.get('host')}/${slug}`,
            slug,
        });

    } catch (error) {
        next(error);
    }
}
