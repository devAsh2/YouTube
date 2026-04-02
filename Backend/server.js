import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import { authRoutes } from "./routes/auth.route.js";
import { videoRoutes } from "./routes/video.route.js";
import { channelRoutes } from "./routes/channel.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);
app.use(express.json());

// Initialize Routes
authRoutes(app);
videoRoutes(app);
channelRoutes(app);

// Database connection
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
