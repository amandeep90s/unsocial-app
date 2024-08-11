import { SerializedErrorOutput } from './types/serialized-error-output';
import BaseCustomError from './base-custom-error';

class DuplicatedEmail extends BaseCustomError {
	protected statusCode = 422;

	protected defaultErrorMessage = 'The email is already in use';

	constructor() {
		super('The email is already in use');

		Object.setPrototypeOf(this, DuplicatedEmail.prototype);
	}

	getStatusCode(): number {
		return this.statusCode;
	}

	serializeErrorOutput(): SerializedErrorOutput {
		return {
			errors: [
				{
					message: this.defaultErrorMessage,
				},
			],
		};
	}
}

export default DuplicatedEmail;
