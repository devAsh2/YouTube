import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { useAuth } from "../hooks/AuthContext";

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login, register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		let result;
		if (isLogin) {
			result = await login(email, password);
		} else {
			result = await register(username, email, password);
		}

		setIsLoading(false);

		if (result.success) {
			navigate("/");
		} else {
			setError(result.message);
		}
	};

	const switchMode = () => {
		setIsLogin((prev) => !prev);
		setError("");
		setUsername("");
		setEmail("");
		setPassword("");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-950">
			<div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
				{/* Logo */}
				<div className="mb-8 flex flex-col items-center">
					<div className="mb-3 flex items-center gap-1">
						<FaYoutube size={32} className="text-red-600" />
						<span className="text-2xl font-bold tracking-tighter text-black dark:text-white">
							YouTube
						</span>
					</div>
					<h1 className="text-xl font-medium text-gray-900 dark:text-white">
						{isLogin ? "Sign in" : "Create account"}
					</h1>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						{isLogin ? "to continue to YouTube" : "to get started with YouTube"}
					</p>
				</div>

				{/* Error message */}
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
						{error}
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Username (register only) */}
					{!isLogin && (
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
								Username
							</label>
							<div className="relative">
								<User
									size={18}
									className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Enter your username"
									required
									minLength={3}
									className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
								/>
							</div>
						</div>
					)}

					{/* Email */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Email
						</label>
						<div className="relative">
							<Mail
								size={18}
								className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
								className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Password
						</label>
						<div className="relative">
							<Lock
								size={18}
								className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
							/>
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
								minLength={6}
								className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-sm text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{!isLogin && (
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Must be 6–25 characters with at least one uppercase letter,
								lowercase letter, and number.
							</p>
						)}
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-900"
					>
						{isLoading
							? "Please wait..."
							: isLogin
								? "Sign in"
								: "Create account"}
					</button>
				</form>

				{/* Switch mode */}
				<div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
					{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
					<button
						onClick={switchMode}
						className="font-medium text-blue-600 hover:underline dark:text-blue-400"
					>
						{isLogin ? "Create account" : "Sign in"}
					</button>
				</div>
			</div>
		</div>
	);
}
