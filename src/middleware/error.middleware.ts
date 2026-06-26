import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error , req: Request , res: Response , next: NextFunction) => {
    
    console.error(`[ERROR] ${req.method} ${req.path}:`, err.message)
    console.error(err.stack)

    res.status(500).json({
        error: 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { message: err.message }),
    })

}