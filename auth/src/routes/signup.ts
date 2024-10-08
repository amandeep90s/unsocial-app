import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models';
import { DuplicatedEmail, InvalidInput } from '../errors';
import { UserSignedUp } from '../events';

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
		const errors = validationResult(req).array();
		const { email, password } = req.body;

		if (/.+@[A-Z]/g.test(email)) {
			errors.push({
				location: 'body',
				value: req.body.email,
				type: 'field',
				path: 'email',
				msg: 'Email is not normalized',
			});
		}

		if (/[<>'"/]/g.test(password)) {
			errors.push({
				location: 'body',
				value: req.body.password,
				type: 'field',
				path: 'password',
				msg: 'Password contains invalid characters',
			});
		}

		if (errors.length > 0) {
			throw new InvalidInput(errors);
		}

		try {
			const newUser = await User.create({ email, password });
			const userSignedUp = new UserSignedUp(newUser);

			return res.status(userSignedUp.getStatusCode()).send(userSignedUp.serializeRest());
		} catch (e) {
			throw new DuplicatedEmail();
		}
	},
);

export default signUpRouter;
