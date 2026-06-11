import { Request, Response, NextFunction } from 'express';
import { getCachedUrl , setCachedUrl} from '../services/cache.service';
import { getUrlBySlug } from '../services/url.service';
import { clickQueue } from '../config/queue';
import { ClickEvent } from '../types';


export async function handleRedirect(req: Request, res: Response, next: NextFunction) {

    try {
        const { slug } = req.params;

        let targetUrl: string;
        let targetId: number;

        const cached = await getCachedUrl(slug as string);

        if(cached) {
            targetUrl = cached.longUrl;
            targetId = cached.urlId;
        } else {
            const urlRecord = await getUrlBySlug(slug as string);

            if(!urlRecord) {
                return res.status(404).json({ message: 'URL not found' });
            }

            targetUrl = urlRecord.longUrl;
            targetId = urlRecord.id;

            await setCachedUrl(slug as string, { longUrl: targetUrl, urlId: targetId });
        }

        res.redirect(302, targetUrl);

        clickQueue.add('click-events', {
            urlId: targetId,
            ipAddress: req.ip || 'Unknown',
            country: (req.headers['cf-ipcountry'] as string) || 'Unknown',
            userAgent: req.headers['user-agent'] || 'Unknown',
            referrer: req.get('Referrer') || 'Unknown',
        } as ClickEvent).catch(err => {
            console.error('Failed to enqueue click event:', err)
        });

    } catch (error) {
        next(error)
    }
}
