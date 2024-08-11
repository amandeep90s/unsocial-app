import User from '../user';
import { BaseCustomError, DuplicatedEmail } from '../../errors';

it('should not save a new user if the email is already in use', async () => {
	const userInfo = { email: 'test@example.com', password: 'ValidPassword123' };

	const newUser1 = await User.create(userInfo);
	expect(newUser1).toBeDefined();
	expect(newUser1.email).toEqual(userInfo.email);

	let err: DuplicatedEmail | undefined;
	try {
		await User.create(userInfo);
	} catch (e) {
		err = e as DuplicatedEmail;

		const serializedErrorOutput = err ? err.serializeErrorOutput() : undefined;
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(BaseCustomError);
		expect(serializedErrorOutput).toBeDefined();
		expect(serializedErrorOutput?.errors).toHaveLength(1);
		expect(serializedErrorOutput?.errors[0].message).toBe('The email is already in use');
	}
});
