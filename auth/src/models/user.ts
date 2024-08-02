import mongoose from 'mongoose';

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

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
