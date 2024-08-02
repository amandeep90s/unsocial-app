import request from 'supertest';
import app from '../../app';
import { SIGNUP_ROUTE } from '../signup';

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

	it('should return 200 if email is valid', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email: 'test@example.com', password }).expect(200);
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

	it('should return 200 if the password is valid', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email, password: 'ValidPass1234' }).expect(200);
	});
});

describe('test sanitization of email input', () => {
	it('should not contain uppercase letters in the domain of the email', async () => {
		const normalizedEmail = 'test@example.com';
		const response = await request(app)
			.post(SIGNUP_ROUTE)
			.send({ email: 'test@EXAMPLE.COM', password: 'ValidPass123' })
			.expect(200);
		expect(response.body.email).toEqual(normalizedEmail);
	});
});

describe('test sanitization of password input', () => {
	it('should not contain unescaped characters', async () => {
		await request(app)
			.post(SIGNUP_ROUTE)
			.send({ email: 'test@example.com', password: 'ValidPass123><' })
			.expect(200);
	});
});

describe('tests saving the signed-up user to the database', () => {
	const userInfo = { email: 'test@example.com', password: 'ValidaPass123' };

	it('should saves the user successfully as long as the information is valid', async () => {
		const response = await request(app).post(SIGNUP_ROUTE).send(userInfo).expect(200);
		expect(response.body.email).toEqual(userInfo.email);
	});

	// it('should not allow saving a user with a duplicate email', () => {});
});
