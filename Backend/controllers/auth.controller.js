import { User } from "../models/User.model.js";
import { generateToken } from "../middleware/auth.middleware.js";
import { handleDatabaseError } from "../middleware/validation.middleware.js";

// POST /api/register - Register a new user
export const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			return res.status(409).json({
				error: "User already exists with this email or username",
			});
		}

		// Create new user
		const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128`;
		const user = new User({ username, email, password, avatar: avatarUrl });
		await user.save();

		const token = generateToken(user._id);

		res.status(201).json({
			message: "User registered successfully",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				channels: user.channels,
			},
			token,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

// POST /api/login - Authenticate user and return JWT token
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Compare password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Generate token
		const token = generateToken(user._id);

		res.json({
			message: "Login successful",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				channels: user.channels,
			},
			token,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};

// User profile api
export const userProfile = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		res.json({
			success: true,
			user,
		});
	} catch (error) {
		handleDatabaseError(error, res);
	}
};
