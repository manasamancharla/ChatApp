import mongoose from "mongoose";

interface IUser extends mongoose.Document {
	username: string;
	password: string;
	role: string[];
	// createdAt?: Date;
	// updatedAt?: Date;
}

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},

		password: {
			type: String,
			required: true,
		},

		role: {
			type: [String],
			default: ["Customer"],
		},
	},
	{ timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser };
