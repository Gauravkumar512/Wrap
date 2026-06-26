import { getAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';

export function authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        next();
    };
}
