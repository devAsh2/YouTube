import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./hooks/SidebarContext";
import { ThemeProvider } from "./hooks/ThemeContext";
import { AuthProvider } from "./hooks/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VideoPage from "./pages/VideoPage";
import ChannelPage from "./pages/ChannelPage";

function App() {
	return (
		<Router>
			<ThemeProvider>
				<AuthProvider>
					<SidebarProvider>
						<Routes>
							<Route path="/auth" element={<Auth />} />
							<Route
								path="/*"
								element={
									<div className="min-h-screen bg-white dark:bg-zinc-900">
										<Navbar />
										<div className="flex">
											<Sidebar />
											<main className="min-h-[calc(100vh-3.5rem)] flex-1">
												<Routes>
													<Route path="/" element={<Home />} />
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
