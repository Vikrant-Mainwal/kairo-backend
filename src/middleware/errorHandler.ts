import type {Response, Request, NextFunction} from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    console.error("message",err.stack, err.message);
    res.status(500).json({ error: 'Internal Server Error' });
}