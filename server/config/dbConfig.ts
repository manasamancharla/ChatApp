import * as mongoose from "mongoose";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.DATABASE_URI as string, {});

		console.log(`[mongodb] MongoDB connected ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
		// process.exit()
	}
};

export default connectDB;
