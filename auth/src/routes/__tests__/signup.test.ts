import request from 'supertest';
import app from '../../app';
import { SIGNUP_ROUTE } from '../signup';
import { User } from '../../models';

/**
 * Valid email conditions:
 * - Standard email formats from 'express-validator' package
 */
describe('test validity of email input', () => {
	let password = '';

	beforeAll(() => {
		password = 'ValidPassword123';
	});

	it('should return 422 if the email is not provided', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ password }).expect(422);
	});

	it('should return 422 if the email is not valid', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email: 'invalidEmail', password }).expect(422);
	});

	it('should return 201 if email is valid', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email: 'test@example.com', password }).expect(201);
	});
});

/**
 * Valid password conditions:
 * - At least 8 characters
 * - At most 32 characters
 * - One lower-case letter
 * - One upper-case letter
 * - One digit
 */
describe('test validity of password input', () => {
	let email = '';

	beforeAll(() => {
		email = 'test@example.com';
	});

	it('should return 422 if the password is not provided', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email }).expect(422);
	});

	it('should return 422 if the password contains less than 8 characters', async () => {
		await request(app)
			.post(SIGNUP_ROUTE)
			.send({
				email,
				password: 'Valid12Valid12Valid12Valid12Valid12Valid12',
			})
			.expect(422);
	});

	it('should return 422 if the password contains more than 32 characters', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email, password: 'Valid12' }).expect(422);
	});

	it('should return 422 if the password does not contain one lower-case letter', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email, password: 'VALID123' }).expect(422);
	});

	it('should return 422 if the password does not contain one upper-case letter', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email, password: 'valid123' }).expect(422);
	});

	it('should return 422 if the password does not contain one digit', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email, password: 'ValidPass' }).expect(422);
	});

	it('should return 201 if the password is valid', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email, password: 'ValidPass1234' }).expect(201);
	});
});

describe('test sanitization of email input', () => {
	it('should not contain uppercase letters in the domain of the email', async () => {
		const normalizedEmail = 'test@example.com';
		const response = await request(app)
			.post(SIGNUP_ROUTE)
			.send({ email: 'test@EXAMPLE.COM', password: 'ValidPass123' })
			.expect(201);
		expect(response.body.email).toEqual(normalizedEmail);
	});
});

describe('test sanitization of password input', () => {
	it('should not contain unescaped characters', async () => {
		await request(app)
			.post(SIGNUP_ROUTE)
			.send({ email: 'test@example.com', password: 'ValidPass123><' })
			.expect(201);
	});
});

describe('tests saving the signed-up user to the database', () => {
	const validUserInfo = { email: 'test@example.com', password: 'ValidaPass123' };

	it('should saves the user successfully as long as the information is valid', async () => {
		const response = await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201);
		const user = await User.findOne({ email: response.body.email });
		const userEmail = user ? user.email : '';

		expect(userEmail).toBeDefined();
		expect(userEmail).toEqual(validUserInfo.email);
	});

	it('should not allow saving a user with a duplicate email', async () => {
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201);
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422);
	});
});
