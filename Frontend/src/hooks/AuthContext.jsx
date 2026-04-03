import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("yt_token");
		if (token) {
			authAPI.getProfile()
				.then((response) => {
					setUser(response.data.user);
				})
				.catch(() => localStorage.removeItem("yt_token"))
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (email, password) => {
		try {
			const response = await authAPI.login({ email, password });
			const { user: userData, token } = response.data;
			localStorage.setItem("yt_token", token);
			setUser(userData);
			return { success: true };
		} catch (err) {
			return { success: false, message: err.response?.data?.message || err.message };
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
			return { success: false, message: err.response?.data?.message || err.message };
		}
	};

	const logout = () => {
		localStorage.removeItem("yt_token");
		setUser(null);
	};

	const value = { user, loading, login, register, logout };

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
