import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("yt_token");
		if (token) {
			authAPI
				.getProfile()
				.then((response) => {
					setUser(response.data.user);
				})
				.catch(() => localStorage.removeItem("yt_token"))
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	// Listen for token expiration events from API interceptor
	useEffect(() => {
		const handleTokenExpired = () => {
			setUser(null);
		};

		window.addEventListener("tokenExpired", handleTokenExpired);
		return () => window.removeEventListener("tokenExpired", handleTokenExpired);
	}, []);

	const extractError = (err) => {
		const data = err.response?.data;
		if (data?.details?.length) return data.details[0];
		return data?.error || data?.message || err.message;
	};

	const login = async (email, password) => {
		try {
			const response = await authAPI.login({ email, password });
			const { user: userData, token } = response.data;
			localStorage.setItem("yt_token", token);
			setUser(userData);
			return { success: true };
		} catch (err) {
			return { success: false, message: extractError(err) };
		}
	};

	const register = async (username, email, password) => {
		try {
			const response = await authAPI.register({ username, email, password });
			const { user: userData, token } = response.data;
			localStorage.setItem("yt_token", token);
			setUser(userData);
			return { success: true };
		} catch (err) {
			return { success: false, message: extractError(err) };
		}
	};

	const logout = () => {
		localStorage.removeItem("yt_token");
		setUser(null);
	};

	const value = { user, setUser, loading, login, register, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
