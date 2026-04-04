import mongoose from "mongoose";

// Sanitization helper functions
const sanitizeString = (str) => {
	if (typeof str !== "string") return str;
	return str
		.trim() // Remove whitespace
		.replace(/[<>]/g, "") // Remove potential HTML tags
		.replace(/javascript:/gi, "") // Remove javascript protocol
		.replace(/on\w+\s*=/gi, ""); // Remove event handlers
};

const sanitizeEmail = (email) => {
	if (typeof email !== "string") return email;
	return email
		.trim()
		.toLowerCase() // Normalize case
		.replace(/[<>]/g, ""); // Remove HTML tags
};

// Database connection error handler
export const handleDatabaseError = (error, res) => {
	if (error.name === "ValidationError") {
		const errors = Object.values(error.errors).map((err) => err.message);
		return res
			.status(400)
			.json({ error: "Validation failed", details: errors });
	}
	if (error.name === "CastError") {
		return res.status(400).json({ error: "Invalid data format" });
	}
	if (error.code === 11000) {
		return res.status(409).json({ error: "Duplicate entry" });
	}
	console.error("Database error:", error);
	return res.status(500).json({ error: "Internal server error" });
};

// Input validation middleware with sanitization
export const handleSignupValidation = (req, res, next) => {
	const { username, email, password } = req.body;
	const errors = [];

	// Sanitize inputs
	req.body.username = sanitizeString(username);
	req.body.email = sanitizeEmail(email);
	// Password is not sanitized to preserve user's exact choice

	// Username validation
	if (!req.body.username) {
		errors.push("Username is required");
	} else if (req.body.username.length < 3) {
		errors.push("Username must be at least 3 characters long");
	} else if (req.body.username.length > 30) {
		errors.push("Username must not exceed 30 characters");
	} else if (!/^[a-zA-Z0-9_]+$/.test(req.body.username)) {
		errors.push("Username can only contain letters, numbers, and underscores");
	}

	// Email validation
	if (!req.body.email) {
		errors.push("Email is required");
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
		errors.push("Please enter a valid email address");
	}

	// Password validation
	if (!password) {
		errors.push("Password is required");
	} else if (password.length < 6) {
		errors.push("Password must be at least 6 characters long");
	} else if (password.length > 25) {
		errors.push("Password must not exceed 25 characters");
	} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
		errors.push(
			"Password must contain at least one uppercase letter, one lowercase letter, and one number",
		);
	}

	// If there are validation errors, return them
	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			error: "Validation failed",
			details: errors,
		});
	}

	// If validation passes, continue to next middleware
	next();
};

// Login validation middleware with sanitization
export const handleLoginValidation = (req, res, next) => {
	const { email, password } = req.body;
	const errors = [];

	// Sanitize inputs
	req.body.email = sanitizeEmail(email);
	// Password is not sanitized

	// Email validation
	if (!req.body.email) {
		errors.push("Email is required");
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
		errors.push("Please enter a valid email address");
	}

	// Password validation
	if (!password) {
		errors.push("Password is required");
	}

	// If there are validation errors, return them
	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			error: "Validation failed",
			details: errors,
		});
	}

	// If validation passes, continue to next middleware
	next();
};

// Video upload validation middleware with sanitization
export const handleVideoValidation = (req, res, next) => {
	const { title, thumbnailUrl, videoUrl, channelId, description } = req.body;
	const errors = [];

	// Sanitize inputs
	req.body.title = sanitizeString(title);
	req.body.description = sanitizeString(description);
	req.body.thumbnailUrl = sanitizeString(thumbnailUrl);
	req.body.videoUrl = sanitizeString(videoUrl);

	// Title validation
	if (!req.body.title) {
		errors.push("Video title is required");
	} else if (req.body.title.length < 1) {
		errors.push("Video title cannot be empty");
	} else if (req.body.title.length > 200) {
		errors.push("Video title must not exceed 200 characters");
	}

	// Thumbnail URL validation
	if (!req.body.thumbnailUrl) {
		errors.push("Thumbnail URL is required");
	} else if (
		!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(req.body.thumbnailUrl)
	) {
		errors.push(
			"Please enter a valid thumbnail URL (jpg, jpeg, png, gif, or webp)",
		);
	}

	// Video URL validation
	if (!req.body.videoUrl) {
		errors.push("Video URL is required");
	} else if (
		!/^https?:\/\/.+\.(mp4|avi|mov|wmv|flv|webm)$/i.test(req.body.videoUrl)
	) {
		errors.push(
			"Please enter a valid video URL (mp4, avi, mov, wmv, flv, or webm)",
		);
	}

	// Channel ID validation
	if (!channelId) {
		errors.push("Channel ID is required");
	} else if (!mongoose.Types.ObjectId.isValid(channelId)) {
		errors.push("Invalid channel ID format");
	}

	// If there are validation errors, return them
	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			error: "Validation failed",
			details: errors,
		});
	}

	// If validation passes, continue to next middleware
	next();
};

export const handleSearchValidation = (req, res, next) => {
	const { q } = req.query;

	if (!q || q.trim().length === 0) {
		return res.status(400).json({
			success: false,
			error: "Search query is required",
		});
	}

	if (q.length > 100) {
		return res.status(400).json({
			success: false,
			error: "Search query must not exceed 100 characters",
		});
	}

	// Sanitize search query
	req.query.q = sanitizeString(q);
	next();
};
