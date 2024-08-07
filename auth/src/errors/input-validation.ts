import { ValidationError } from 'express-validator';
import BaseCustomError from './base-custom-error';
import { SerializedErrorField, SerializedErrorOutput } from './types/serialized-error-output';

export type InvalidInputConstructorErrorParams = ValidationError[];

class InvalidInput extends BaseCustomError {
	private readonly errors: ValidationError[] | undefined;

	protected statusCode = 422;

	private defaultErrorMessage = 'The input provided is invalid';

	constructor(errors?: InvalidInputConstructorErrorParams) {
		super('The input provided is invalid');
		this.errors = errors;
		Object.setPrototypeOf(this, InvalidInput.prototype);
	}

	getStatusCode(): number {
		return this.statusCode;
	}

	serializeErrorOutput(): SerializedErrorOutput {
		return this.parseValidationErrors();
	}

	private parseValidationErrors(): SerializedErrorOutput {
		const parsedErrors: SerializedErrorField = {};

		if (this.errors && this.errors.length) {
			this.errors.forEach((error) => {
				if (error.type === 'field') {
					if (parsedErrors[error.path]) {
						parsedErrors[error.path].push(error.msg);
					} else {
						parsedErrors[error.path] = [error.msg];
					}
				}
			});
		}
		return {
			errors: [
				{
					message: this.defaultErrorMessage,
					fields: parsedErrors,
				},
			],
		};
	}
}

export default InvalidInput;
