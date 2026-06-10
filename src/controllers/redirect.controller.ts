import { Request, Response } from 'express';
import { getCachedUrl , setCachedUrl} from '../services/cache.service';
import { getLongUrl } from '../services/url.service';

export async function handleRedirect(req: Request, res: Response) {

    try {
        const { slug } = req.params;
        const cachedUrl = await getCachedUrl(slug as string);

        if(cachedUrl){
            console.log('Cache hit for slug:', slug);
            return res.redirect(302, cachedUrl);
        }

        console.log('Cache miss for slug:', slug);
        const longUrl = await getLongUrl(slug as string);

        if(!longUrl) {
            return res.status(404).json({ message: 'URL not found' });
        }

        await setCachedUrl(slug as string, longUrl);
        res.redirect(302, longUrl);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}