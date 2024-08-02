import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
	mongod = await MongoMemoryServer.create();
	const mongoUri = mongod.getUri();
	await mongoose.connect(mongoUri);
});

afterEach(async () => {
	const allCollections = await mongoose.connection.db.collections();
	await Promise.all(allCollections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
	await mongod.stop();
	await mongoose.connection.close();
});
