import { User } from '../../models';
import { UserSignedUp } from '../index';

it('should expose only the id and the email when serializing to REST', async () => {
	const newUser = await User.create({ email: 'test@example.com', password: 'ValidPassword123' });
	const userSignedUpEvent = new UserSignedUp(newUser);
	const serializedResponse = userSignedUpEvent.serializeRest();

	expect(Object.keys(serializedResponse).sort()).toEqual(['id', 'email'].sort());
	expect(serializedResponse.email).toBe(newUser.email);
	expect(userSignedUpEvent.getStatusCode()).toBe(201);
});
