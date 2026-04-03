export async function loginUser(email, password) {
	const res = await fetch("/api/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});
	const data = await res.json();
	if (!res.ok) {
		const message = data.details
			? data.details[0]
			: data.error || "Login failed";
		throw new Error(message);
	}
	return data;
}

export async function registerUser(username, email, password) {
	const res = await fetch("/api/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, email, password }),
	});
	const data = await res.json();
	if (!res.ok) {
		const message = data.details
			? data.details[0]
			: data.error || "Registration failed";
		throw new Error(message);
	}
	return data;
}

export async function fetchProfile(token) {
	const res = await fetch("/api/profile", {
		headers: { Authorization: `Bearer ${token}` },
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
	return data.user;
}
