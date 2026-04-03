import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, fetchProfile } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("yt_token");
		if (token) {
			fetchProfile(token)
				.then((profileUser) => setUser(profileUser))
				.catch(() => localStorage.removeItem("yt_token"))
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

	const login = async (email, password) => {
		try {
			const { user: userData, token } = await loginUser(email, password);
			localStorage.setItem("yt_token", token);
			setUser(userData);
			return { success: true };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};

	const register = async (username, email, password) => {
		try {
			const { user: userData, token } = await registerUser(
				username,
				email,
				password,
			);
			localStorage.setItem("yt_token", token);
			setUser(userData);
			return { success: true };
		} catch (err) {
			return { success: false, message: err.message };
		}
	};

	const logout = () => {
		localStorage.removeItem("yt_token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
