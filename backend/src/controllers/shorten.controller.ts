import { isIP } from 'net';
import { Request, Response, NextFunction } from 'express';
import { ExpressRequestWithAuth } from '@clerk/express';
import { createShortUrl } from '../services/url.service';
import { ShortenSchema } from '../schemas/shorten.schema';

const ALLOWED_SCHEMES = new Set(['http:', 'https:']);

function isPrivateAddress(hostname: string): boolean {
    const h = hostname.toLowerCase();
    if (h === 'localhost' || h === '0.0.0.0') return true;
    if (/\.(local|internal|lan)$/.test(h)) return true;
    const v = isIP(hostname);
    if (v === 4) {
        const [a, b] = hostname.split('.').map(Number);
        return (
            a === 10 ||
            a === 127 ||
            a === 0 ||
            (a === 172 && b >= 16 && b <= 31) ||
            (a === 192 && b === 168) ||
            (a === 169 && b === 254)
        );
    }
    if (v === 6) {
        return (
            h === '::1' || h === '::' ||
            h.startsWith('fe80:') || h.startsWith('fc') || h.startsWith('fd')
        );
    }
    return false;
}

export async function handleShorten(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const validation = ShortenSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ message: 'Invalid request data', errors: validation.error.issues });
            return;
        }

        const { longUrl } = validation.data;

        // Block dangerous schemes (javascript:, data:, vbscript:, blob:, etc.)
        let parsed: URL;
        try { parsed = new URL(longUrl); } catch {
            res.status(400).json({ message: 'Invalid URL' });
            return;
        }
        if (!ALLOWED_SCHEMES.has(parsed.protocol)) {
            res.status(400).json({ message: 'Only http and https URLs are allowed.' });
            return;
        }
        // Block direct private/loopback IP addresses (SSRF protection)
        // Note: this does not resolve hostnames via DNS — a full SSRF guard
        // would require async DNS resolution with a private-ip check package.
        if (isPrivateAddress(parsed.hostname)) {
            res.status(400).json({ message: 'URL resolves to a private or reserved address.' });
            return;
        }

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
