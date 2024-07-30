import request from 'supertest';
import app from '../../app';

// it('should return 405 for non-posts requests to the signup route', () => {
//   //
// });

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
		await request(app).post('/api/auth/signup').send({ password }).expect(422);
	});

	it('should return 422 if the email is not valid', async () => {
		await request(app)
			.post('/api/auth/signup')
			.send({ email: 'invalidEmail', password })
			.expect(422);
	});

	it('should return 200 if email is valid', async () => {
		await request(app)
			.post('/api/auth/signup')
			.send({ email: 'test@example.com', password })
			.expect(200);
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
		await request(app).post('/api/auth/signup').send({ email }).expect(422);
	});

	it('should return 422 if the password contains less than 8 characters', async () => {
		await request(app)
			.post('/api/auth/signup')
			.send({
				email,
				password: 'Valid12Valid12Valid12Valid12Valid12Valid12',
			})
			.expect(422);
	});

	it('should return 422 if the password contains more than 32 characters', async () => {
		await request(app).post('/api/auth/signup').send({ email, password: 'Valid12' }).expect(422);
	});

	it('should return 422 if the password does not contain one lower-case letter', async () => {
		await request(app).post('/api/auth/signup').send({ email, password: 'VALID123' }).expect(422);
	});

	it('should return 422 if the password does not contain one upper-case letter', async () => {
		await request(app).post('/api/auth/signup').send({ email, password: 'valid123' }).expect(422);
	});

	it('should return 422 if the password does not contain one digit', async () => {
		await request(app).post('/api/auth/signup').send({ email, password: 'ValidPass' }).expect(422);
	});

	it('should return 200 if the password is valid', async () => {
		await request(app)
			.post('/api/auth/signup')
			.send({ email, password: 'ValidPass1234' })
			.expect(200);
	});
});
