import { Request, Response, NextFunction } from 'express';
import { ExpressRequestWithAuth } from '@clerk/express';
import { getAnalytic } from '../services/analytics.service';

export async function handleAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const slug = req.params.slug as string;
        const { userId: clerkUserId } = (req as ExpressRequestWithAuth).auth();

        const analyticData = await getAnalytic(slug, clerkUserId!);

        if(analyticData === null) {
            res.status(404).json({ message: 'URL not found' });
            return;
        }

        if(analyticData === 'forbidden') {
            res.status(403).json({ message: 'You do not have access to this URL\'s analytics' });
            return;
        }

        res.status(200).json(analyticData);
    } catch (error) {
        next(error);
    }
}
