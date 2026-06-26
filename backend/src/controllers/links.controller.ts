import { Request, Response, NextFunction } from 'express';
import { ExpressRequestWithAuth } from '@clerk/express';
import { getUserLinks, deleteLink } from '../services/url.service';

export async function handleGetLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { userId: clerkUserId } = (req as ExpressRequestWithAuth).auth();
        if (!clerkUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const links = await getUserLinks(clerkUserId);
        res.status(200).json({ links });
    } catch (error) {
        next(error);
    }
}

export async function handleDeleteLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { userId: clerkUserId } = (req as ExpressRequestWithAuth).auth();
        if (!clerkUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const slug = req.params.slug as string;
        await deleteLink(slug, clerkUserId);
        res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
        if (error instanceof Error && error.message === 'Link not found') {
            res.status(404).json({ message: 'Link not found' });
            return;
        }
        if (error instanceof Error && error.message === 'Unauthorized') {
            res.status(403).json({ message: 'You do not have permission to delete this link' });
            return;
        }
        next(error);
    }
}
