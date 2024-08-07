import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models';

export const SIGNUP_ROUTE = '/api/auth/signup';

const signUpRouter = express.Router();

signUpRouter.post(
	SIGNUP_ROUTE,
	[
		body('email').isEmail().withMessage('Email must be in a valid format').normalizeEmail(),
		body('password')
			.trim()
			.isLength({
				min: 8,
				max: 32,
			})
			.withMessage('Password must be between 8 and 32 characters'),
		body('password')
			.matches(/^(.*[a-z].*)$/)
			.withMessage('Password must contain at least one lower-case letter'),
		body('password')
			.matches(/^(.*[A-Z].*)$/)
			.withMessage('Password must contain at least one upper-case letter'),
		body('password')
			.matches(/^(.*\d.*)$/)
			.withMessage('Password must contain at least one digit'),
		body('password').escape(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		const { email, password } = req.body;

		if (!errors.isEmpty() || /.+@[A-Z]/g.test(email) || /[<>'"/]/g.test(password)) {
			return res.status(422).send({});
		}

		try {
			const newUser = await User.create({ email, password });
			res.status(201).send(newUser);
		} catch (e) {
			res.sendStatus(422);
		}
	},
);

export default signUpRouter;
