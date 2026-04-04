import { categories } from "../data/categories";

export default function FilterBar({ activeFilter, onFilterChange }) {
	return (
		<div className="hide-scrollbar sticky top-14 z-30 flex gap-3 overflow-x-auto border-b border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-zinc-700 dark:bg-zinc-900">
			{categories.map((category) => (
				<button
					key={category}
					onClick={() => onFilterChange(category)}
					className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
						activeFilter === category
							? "bg-black text-white dark:bg-white dark:text-black"
							: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
					}`}
				>
					{category}
				</button>
			))}
		</div>
	);
}
