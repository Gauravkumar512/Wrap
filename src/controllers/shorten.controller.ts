import { Request,Response } from 'express';
import { createShortUrl } from '../services/url.service';

export async function handleShorten(req: Request, res: Response) {
    try {
        const { longUrl, userId } = req.body;

        if(!longUrl) {
            return res.status(400).json({ message: 'Long URL is required' });
        }

        const slug = await createShortUrl({ longUrl, userId });
        res.status(201).json({
            message: 'Short URL created successfully',
            shortUrl: `${req.protocol}://${req.get('host')}/${slug}`,
            slug: slug
        })

    }
    
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}