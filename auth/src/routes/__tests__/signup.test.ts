import request from 'supertest';
import app from '../../app';
import { SIGNUP_ROUTE } from '../signup';

/**
 * Available methods for the signup route:
 *  - POST
 */
describe('test signup route method availability', () => {
	let email = '';
	let password = '';

	beforeAll(() => {
		email = 'test@example.com';
		password = 'ValidPassword123';
	});

	it('should return 405 for non-posts requests', async () => {
		await request(app).get(SIGNUP_ROUTE).expect(405);
		await request(app).put(SIGNUP_ROUTE).expect(405);
		await request(app).patch(SIGNUP_ROUTE).expect(405);
		await request(app).delete(SIGNUP_ROUTE).expect(405);
	});

	it('should return 200 for post requests', async () => {
		await request(app).post(SIGNUP_ROUTE).send({ email, password }).expect(200);
	});
});

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
