import { InvalidInput } from '../index';
import { InvalidInputConstructorErrorParams } from '../input-validation';

describe('tests the InvalidInput custom error class', () => {
	it('should have a status code of 422', async () => {
		const invalidInputError = new InvalidInput();
		expect(invalidInputError.getStatusCode()).toBe(422);
	});

	it('should return the errors in the serialized format', () => {
		const errors: InvalidInputConstructorErrorParams = [
			{
				type: 'field',
				location: 'body',
				path: 'password',
				value: 'Valid12',
				msg: 'Password must be between 8 and 32 characters',
			},
			{
				type: 'field',
				location: 'body',
				path: 'password',
				value: 'valid123',
				msg: 'Password must contain an uppercase letter',
			},
		];

		const result = {
			fields: {
				password: [
					'Password must be between 8 and 32 characters',
					'Password must contain an uppercase letter',
				],
			},
		};

		const invalidInputError = new InvalidInput(errors);
		const serializedErrors = invalidInputError.serializeErrorOutput();
		expect(serializedErrors.errors).toHaveLength(1);

		const { fields = {} } = serializedErrors.errors[0];
		expect(serializedErrors.errors[0].message).toBe('The input provided is invalid');
		expect(Object.keys(fields)).toHaveLength(1);
		expect(Object.keys(fields)).toEqual(['password']);
		expect(fields.password).toHaveLength(2);
		expect(fields.password).toContain('Password must be between 8 and 32 characters');
		expect(fields.password).toContain('Password must contain an uppercase letter');
	});
});
