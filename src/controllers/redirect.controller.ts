import { Request, Response, NextFunction } from 'express';
import { getCachedUrl , setCachedUrl} from '../services/cache.service';
import { getUrlBySlug } from '../services/url.service';
import { clickQueue } from '../config/queue';
import { ClickEvent } from '../types';


export async function handleRedirect(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const slug = req.params.slug as string;

        let targetUrl: string;
        let targetId: number;

        const cached = await getCachedUrl(slug);

        if(cached) {
            if(new Date(cached.expiresAt) < new Date()) {
                res.status(410).json({ error: 'Gone', message: 'This link has expired' });
                return;
            }
            targetUrl = cached.longUrl;
            targetId = cached.urlId;
        } else {
            const urlRecord = await getUrlBySlug(slug);

            if(!urlRecord) {
                res.status(404).json({ message: 'URL not found' });
                return;
            }

            if(urlRecord.expiresAT < new Date()) {
                res.status(410).json({ error: 'Gone', message: 'This link has expired' });
                return;
            }

            targetUrl = urlRecord.longUrl;
            targetId = urlRecord.id;

            await setCachedUrl(slug, { longUrl: targetUrl, urlId: targetId, expiresAt: urlRecord.expiresAT });
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
