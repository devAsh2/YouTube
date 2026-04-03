// Dummy users aligned with the backend User model schema
export const dummyUsers = [
	{
		_id: "user01",
		username: "JohnDoe",
		email: "john@example.com",
		password: "john123456",
		avatar: "https://picsum.photos/seed/john/80/80",
		channels: ["channel01"],
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		_id: "user02",
		username: "JaneSmith",
		email: "jane@example.com",
		password: "jane123456",
		avatar: "https://picsum.photos/seed/jane/80/80",
		channels: [],
		createdAt: "2024-03-20T14:30:00Z",
	},
	{
		_id: "user03",
		username: "TechGuru",
		email: "tech@example.com",
		password: "tech123456",
		avatar: "https://picsum.photos/seed/techguru/80/80",
		channels: ["channel03"],
		createdAt: "2024-06-10T09:15:00Z",
	},
];
