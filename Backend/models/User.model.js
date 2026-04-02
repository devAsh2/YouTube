import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		avatar: {
			type: String,
			default: null,
		},
		channels: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Channel",
			},
		],
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function () {
	console.log("Pre-save middleware called");

	// Only hash if password is new or modified
	if (!this.isModified("password")) {
		console.log("Password not modified, skipping hash");
		return;
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		console.log("Password hashed successfully");
	} catch (error) {
		console.log("Error hashing password:", error);
		throw error; // Mongoose will handle the error
	}
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
	// Convert to string to handle numbers in JSON requests
	const candidateStr = String(candidatePassword);
	return await bcrypt.compare(candidateStr, this.password);
};

export const User = mongoose.model("User", userSchema);
