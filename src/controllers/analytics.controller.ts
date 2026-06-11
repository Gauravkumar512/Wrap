import { Request, Response, NextFunction } from 'express';
import { getAnalytic } from '../services/analytics.service';

export async function handleAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        const { slug } = req.params;

        const analyticData = await getAnalytic(slug as string);

        if(!analyticData) {
            res.status(404).json({ message: 'URL not found' });
            return;
        }

        res.status(200).json(analyticData);
    } catch (error) {
        next(error);
    }
}