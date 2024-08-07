import User from '../user';

it('should not save a new user if the email is already in use', async () => {
	const userInfo = { email: 'test@example.com', password: 'ValidPassword123' };

	const newUser1 = await User.create(userInfo);
	expect(newUser1).toBeDefined();
	expect(newUser1.email).toEqual(userInfo.email);

	let err: Error;
	try {
		await User.create(userInfo);
	} catch (e) {
		err = e as Error;
		expect(err).toBeDefined();
		expect(err.message).toEqual('Email is already in use');
	}
});
