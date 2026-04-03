import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Search, Sun, Moon, UserCircle, X, LogOut } from "lucide-react";
import { useSidebar } from "../hooks/SidebarContext";
import { useTheme } from "../hooks/ThemeContext";
import { useAuth } from "../hooks/AuthContext";

export default function Navbar() {
	const { toggle } = useSidebar();
	const { darkMode, toggleTheme } = useTheme();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") || "",
	);
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const menuRef = useRef(null);

	// Close user menu on outside click
	useEffect(() => {
		const handler = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setShowUserMenu(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		const trimmed = searchQuery.trim();
		if (trimmed) {
			navigate(`/?search=${encodeURIComponent(trimmed)}`);
		} else {
			navigate("/");
		}
		setShowMobileSearch(false);
	};

	return (
		<header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-white px-4 dark:bg-zinc-900">
			{/* Left section */}
			<div
				className={`flex items-center gap-4 ${showMobileSearch ? "hidden sm:flex" : "flex"}`}
			>
				<button
					onClick={toggle}
					className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
					aria-label="Toggle sidebar"
				>
					<Menu size={20} className="text-gray-700 dark:text-gray-200" />
				</button>
				<Link
					to="/"
					className="flex items-center gap-0.5 text-lg font-bold no-underline"
				>
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600">
						<svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
							<polygon points="10,8 16,12 10,16" />
						</svg>
					</div>
					<span className="ml-0.5 text-xl tracking-tighter text-black dark:text-white">
						YouTube
					</span>
				</Link>
			</div>

			{/* Center section - Search bar */}
			<form
				onSubmit={handleSearch}
				className={`${showMobileSearch ? "flex" : "hidden sm:flex"} mx-4 max-w-xl flex-1 items-center`}
			>
				{showMobileSearch && (
					<button
						type="button"
						onClick={() => setShowMobileSearch(false)}
						className="mr-2 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
					>
						<X size={20} className="text-gray-700 dark:text-gray-200" />
					</button>
				)}
				<div className="flex w-full">
					<input
						type="text"
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full rounded-l-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-black outline-none focus:border-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-400"
					/>
					<button
						type="submit"
						className="rounded-r-full border border-l-0 border-gray-300 bg-gray-50 px-5 hover:bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600"
					>
						<Search size={18} className="text-gray-600 dark:text-gray-300" />
					</button>
				</div>
			</form>

			{/* Right section */}
			<div
				className={`flex items-center gap-1 ${showMobileSearch ? "hidden sm:flex" : "flex"}`}
			>
				{/* Mobile search toggle */}
				<button
					onClick={() => setShowMobileSearch(true)}
					className="rounded-full p-2 hover:bg-gray-100 sm:hidden dark:hover:bg-zinc-800"
					aria-label="Search"
				>
					<Search size={20} className="text-gray-700 dark:text-gray-200" />
				</button>

				{/* Theme toggle */}
				<button
					onClick={toggleTheme}
					className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
					aria-label="Toggle theme"
				>
					{darkMode ? (
						<Sun size={20} className="text-gray-200" />
					) : (
						<Moon size={20} className="text-gray-700" />
					)}
				</button>

				{/* Sign in / User menu */}
				{user ? (
					<div className="relative" ref={menuRef}>
						<button
							onClick={() => setShowUserMenu((prev) => !prev)}
							className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-800"
						>
							<img
								src={user.avatar}
								alt={user.username}
								className="h-8 w-8 rounded-full object-cover"
							/>
						</button>
						{showUserMenu && (
							<div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
								<div className="border-b border-gray-200 px-4 pb-3 dark:border-zinc-700">
									<div className="flex items-center gap-3">
										<img
											src={user.avatar}
											alt={user.username}
											className="h-10 w-10 rounded-full object-cover"
										/>
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{user.username}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{user.email}
											</p>
										</div>
									</div>
								</div>
								<button
									onClick={() => {
										logout();
										setShowUserMenu(false);
									}}
									className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
								>
									<LogOut size={18} />
									Sign out
								</button>
							</div>
						)}
					</div>
				) : (
					<Link
						to="/auth"
						className="flex items-center gap-1.5 rounded-full border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-600 no-underline hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950"
					>
						<UserCircle size={20} />
						<span className="hidden sm:inline">Sign in</span>
					</Link>
				)}
			</div>
		</header>
	);
}
