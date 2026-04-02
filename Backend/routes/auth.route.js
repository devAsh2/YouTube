import { signup, login, userProfile } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
	handleLoginValidation,
	handleSignupValidation,
} from "../middleware/validation.middleware.js";

export function authRoutes(app) {
	// Post api to register a new user
	app.post("/api/signup", handleSignupValidation, signup);
	// Post api to login a user
	app.post("/api/login", handleLoginValidation, login);
	// User profile api
	app.get("/api/profile", authenticateToken, userProfile);
}
