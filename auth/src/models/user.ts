import mongoose from 'mongoose';
import { DuplicatedEmail } from '../errors';

export type UserDocument = mongoose.Document & {
	email: string;
	password: string;
};

export type UserModel = mongoose.Model<UserDocument>;

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// Pre-save hook to check if the email already exists
userSchema.pre('save', async function preSaveFunction(this: UserDocument, next) {
	const existingUser = await mongoose.models.User.findOne({ email: this.email });
	if (existingUser) {
		throw new DuplicatedEmail();
	}
	next();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
