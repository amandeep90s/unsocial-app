import { NextFunction, Request, Response } from 'express';

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error) {
		return res.sendStatus(422);
	}

	res.sendStatus(500);
};

export default errorHandler;
