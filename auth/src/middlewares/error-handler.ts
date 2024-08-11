import { NextFunction, Request, Response } from 'express';
import { BaseCustomError } from '../errors';

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof BaseCustomError) {
		return res.status(error.getStatusCode()).send(error.serializeErrorOutput());
	}

	res.sendStatus(500);
};

export default errorHandler;
