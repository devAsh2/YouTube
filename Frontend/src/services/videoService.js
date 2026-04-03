const authHeader = (token) => ({
	Authorization: `Bearer ${token}`,
});

export async function fetchAllVideos(token) {
	const res = await fetch("/api/videos", {
		headers: authHeader(token),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to fetch videos");
	return data.fetchedVideos;
}

export async function searchVideosByTitle(query, token) {
	const res = await fetch(`/api/videos/search?q=${encodeURIComponent(query)}`, {
		headers: authHeader(token),
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Search failed");
	return data.searchedVideos;
}

export async function fetchVideosByCategory(category, token) {
	const res = await fetch(
		`/api/videos/category/${encodeURIComponent(category)}`,
		{ headers: authHeader(token) },
	);
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to filter videos");
	return data.videos;
}
