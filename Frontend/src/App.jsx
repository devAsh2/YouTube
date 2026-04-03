import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./hooks/SidebarContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
	return (
		<Router>
			<ThemeProvider>
				<SidebarProvider>
					<div className="min-h-screen bg-white dark:bg-zinc-900">
						<Navbar />
						<div className="flex">
							<Sidebar />
							<main className="min-h-[calc(100vh-3.5rem)] flex-1">
								<Routes>
									<Route path="/" element={<Home />} />
								</Routes>
							</main>
						</div>
					</div>
				</SidebarProvider>
			</ThemeProvider>
		</Router>
	);
}

export default App;
