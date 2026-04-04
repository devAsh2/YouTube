import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance with base configuration
const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // For cookies
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("yt_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Add response interceptor to handle token expiration (401 errors)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			localStorage.removeItem("yt_token");
			// Dispatch custom event to notify Auth context
			window.dispatchEvent(new Event("tokenExpired"));
			// Redirect to home page (where login button is visible in navbar)
			window.location.href = "/";
		}
		return Promise.reject(error);
	},
);

// Video API endpoints
export const videoAPI = {
	// Single video operations
	getVideo: (videoId) => api.get(`/api/videos/${videoId}`),

	// Multiple video operations
	getAllVideos: () => api.get("/api/videos"),
	searchVideos: (query) =>
		api.get(`/api/videos/search?q=${encodeURIComponent(query)}`),
	getVideosByCategory: (category) =>
		api.get(`/api/videos/category/${encodeURIComponent(category)}`),

	// Video interactions
	likeVideo: (videoId) => api.post(`/api/videos/${videoId}/like`),
	dislikeVideo: (videoId) => api.post(`/api/videos/${videoId}/dislike`),
	incrementView: (videoId) => api.post(`/api/videos/${videoId}/view`),

	// Video CRUD
	createVideo: (data) => api.post("/api/videos", data),
	updateVideo: (videoId, data) => api.put(`/api/videos/${videoId}`, data),
	deleteVideo: (videoId) => api.delete(`/api/videos/${videoId}`),
};

// Auth API endpoints
export const authAPI = {
	login: (credentials) => api.post("/api/login", credentials),
	register: (userData) => api.post("/api/signup", userData),
	logout: () => api.post("/api/auth/logout"),
	refreshToken: () => api.post("/api/auth/refresh"),
	getProfile: () => api.get("/api/profile"),
};

// Channel API endpoints
export const channelAPI = {
	getChannel: (channelId) => api.get(`/api/channels/${channelId}`),
	createChannel: (data) => api.post("/api/channels", data),
	getChannelVideos: (channelId) => api.get(`/api/channels/${channelId}/videos`),
	subscribeToChannel: (channelId) =>
		api.post(`/api/channels/${channelId}/subscribe`),
	unsubscribeFromChannel: (channelId) =>
		api.delete(`/api/channels/${channelId}/subscribe`),
};

// Comment API endpoints
export const commentAPI = {
	getComments: (videoId) => api.get(`/api/comments/${videoId}`),
	addComment: (data) => api.post(`/api/comments`, data),
	updateComment: (commentId, data) =>
		api.put(`/api/comments/${commentId}`, data),
	deleteComment: (commentId) => api.delete(`/api/comments/${commentId}`),
};

export default api;
