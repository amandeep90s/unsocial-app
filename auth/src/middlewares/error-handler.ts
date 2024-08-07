import { NextFunction, Request, Response } from 'express';
import { BaseCustomError } from '../errors/base-custom-error';

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof BaseCustomError) {
		return res.sendStatus(error.getStatusCode());
	}

	res.sendStatus(500);
};

export default errorHandler;
