import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./hooks/SidebarContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import { AuthProvider } from "./hooks/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import VideoPage from "./pages/VideoPage";
import ChannelPage from "./pages/ChannelPage";

function App() {
	return (
		<Router>
			<ThemeProvider>
				<AuthProvider>
					<SidebarProvider>
						<Routes>
							<Route path="/auth" element={<AuthPage />} />
							<Route
								path="/*"
								element={
									<div className="min-h-screen bg-white dark:bg-zinc-900">
										<Navbar />
										<div className="flex">
											<Sidebar />
											<main className="min-h-[calc(100vh-3.5rem)] min-w-0 flex-1 overflow-x-hidden">
												<Routes>
													<Route path="/" element={<HomePage />} />
													<Route
														path="/video/:videoId"
														element={<VideoPage />}
													/>
													<Route
														path="/channel/:channelId"
														element={<ChannelPage />}
													/>
												</Routes>
											</main>
										</div>
									</div>
								}
							/>
						</Routes>
					</SidebarProvider>
				</AuthProvider>
			</ThemeProvider>
		</Router>
	);
}

export default App;
