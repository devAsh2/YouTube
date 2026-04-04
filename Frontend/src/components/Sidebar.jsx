import { Link, useLocation } from "react-router-dom";
import {
	Home,
	Flame,
	ShoppingBag,
	Music,
	Film,
	Radio,
	Gamepad2,
	Newspaper,
	Trophy,
	History,
	ListVideo,
	Clock,
	ThumbsUp,
	PlaySquare,
	Compass,
} from "lucide-react";
import { useSidebar } from "../hooks/SidebarContext";

const mainItems = [
	{ icon: Home, label: "Home", path: "/" },
	{ icon: PlaySquare, label: "Shorts", path: "/shorts" },
	{ icon: ListVideo, label: "Subscriptions", path: "/subscriptions" },
];

const youItems = [
	{ icon: History, label: "History", path: "/history" },
	{ icon: ListVideo, label: "Playlists", path: "/playlists" },
	{ icon: Clock, label: "Watch later", path: "/watch-later" },
	{ icon: ThumbsUp, label: "Liked videos", path: "/liked" },
];

const exploreItems = [
	{ icon: Flame, label: "Trending", path: "/trending" },
	{ icon: ShoppingBag, label: "Shopping", path: "/shopping" },
	{ icon: Music, label: "Music", path: "/music" },
	{ icon: Film, label: "Movies", path: "/movies" },
	{ icon: Radio, label: "Live", path: "/live" },
	{ icon: Gamepad2, label: "Gaming", path: "/gaming" },
	{ icon: Newspaper, label: "News", path: "/news" },
	{ icon: Trophy, label: "Sports", path: "/sports" },
];

function SidebarItem({ icon: Icon, label, path, isActive }) {
	const isHome = path === "/";

	const content = (
		<div
			className={`flex items-center gap-5 rounded-lg px-3 py-2 text-sm ${
				isActive
					? "bg-gray-100 font-medium dark:bg-zinc-800"
					: "hover:bg-gray-100 dark:hover:bg-zinc-800"
			}`}
		>
			<Icon size={20} className="shrink-0 text-gray-700 dark:text-gray-300" />
			<span className="text-gray-900 dark:text-gray-100">{label}</span>
		</div>
	);

	if (isHome) {
		return (
			<Link to={path} className="no-underline">
				{content}
			</Link>
		);
	}

	return <div className="cursor-pointer">{content}</div>;
}

function SidebarSection({ title, items, currentPath }) {
	return (
		<div className="border-b border-gray-200 py-3 dark:border-zinc-700">
			{title && (
				<h3 className="mb-1 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">
					{title}
				</h3>
			)}
			{items.map((item) => (
				<SidebarItem
					key={item.label}
					{...item}
					isActive={currentPath === item.path}
				/>
			))}
		</div>
	);
}

export default function Sidebar() {
	const { isOpen, toggle } = useSidebar();
	const location = useLocation();
	const isMobile = window.innerWidth < 768;

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && isMobile && (
				<div
					className="fixed inset-0 z-40 bg-black/50 md:hidden"
					onClick={toggle}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`hide-scrollbar fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-60 overflow-y-auto bg-white transition-transform duration-200 dark:bg-zinc-900 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} md:z-0`}
			>
				<nav className="px-2 pb-4">
					<SidebarSection items={mainItems} currentPath={location.pathname} />
					<SidebarSection
						title="You"
						items={youItems}
						currentPath={location.pathname}
					/>
					<SidebarSection
						title="Explore"
						items={exploreItems}
						currentPath={location.pathname}
					/>
				</nav>
			</aside>
		</>
	);
}
