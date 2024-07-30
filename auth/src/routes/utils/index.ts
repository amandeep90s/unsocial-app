import { Request, Response } from 'express';

export const handleMethodNotAllowed = (req: Request, res: Response): Response =>
	res.sendStatus(405);
