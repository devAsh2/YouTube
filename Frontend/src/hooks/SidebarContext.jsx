import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
	const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

	useEffect(() => {
		const handleResize = () => {
			setIsOpen(window.innerWidth >= 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggle = () => setIsOpen((prev) => !prev);

	return (
		<SidebarContext.Provider value={{ isOpen, toggle }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	return useContext(SidebarContext);
}
