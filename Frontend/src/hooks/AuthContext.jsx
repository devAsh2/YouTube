import { createContext, useContext, useState, useEffect } from "react";
import { dummyUsers } from "../data/dummyUsers";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("yt_user");
		return saved ? JSON.parse(saved) : null;
	});

	useEffect(() => {
		if (user) {
			localStorage.setItem("yt_user", JSON.stringify(user));
		} else {
			localStorage.removeItem("yt_user");
			localStorage.removeItem("yt_token");
		}
	}, [user]);

	// Simulates POST /auth/login
	const login = (email, password) => {
		const found = dummyUsers.find(
			(u) => u.email === email.toLowerCase() && u.password === password,
		);
		if (!found) {
			return { success: false, message: "Invalid email or password" };
		}
		const { password: _, ...safeUser } = found;
		const fakeToken = `jwt_${found._id}_${Date.now()}`;
		localStorage.setItem("yt_token", fakeToken);
		setUser(safeUser);
		return { success: true };
	};

	// Simulates POST /auth/signup
	const register = (username, email, password) => {
		const emailExists = dummyUsers.find((u) => u.email === email.toLowerCase());
		if (emailExists) {
			return { success: false, message: "Email already in use" };
		}
		const usernameExists = dummyUsers.find(
			(u) => u.username.toLowerCase() === username.toLowerCase(),
		);
		if (usernameExists) {
			return { success: false, message: "Username already taken" };
		}
		if (username.length < 3) {
			return {
				success: false,
				message: "Username must be at least 3 characters",
			};
		}
		if (password.length < 6) {
			return {
				success: false,
				message: "Password must be at least 6 characters",
			};
		}

		const newUser = {
			_id: `user_${Date.now()}`,
			username,
			email: email.toLowerCase(),
			password,
			avatar: `https://picsum.photos/seed/${username}/80/80`,
			channels: [],
			createdAt: new Date().toISOString(),
		};
		dummyUsers.push(newUser);

		const { password: _, ...safeUser } = newUser;
		const fakeToken = `jwt_${newUser._id}_${Date.now()}`;
		localStorage.setItem("yt_token", fakeToken);
		setUser(safeUser);
		return { success: true };
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
