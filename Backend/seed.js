import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.model.js";
import { Channel } from "./models/Channel.model.js";
import { Video } from "./models/Video.model.js";

dotenv.config();

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/youtube-clone";

const users = [
	{
		username: "TechWithTim",
		email: "tim@example.com",
		password: "Pass123",
		avatar:
			"https://ui-avatars.com/api/?name=T&background=random&color=fff&size=128",
	},
	{
		username: "MusicVibes",
		email: "music@example.com",
		password: "Pass123",
		avatar:
			"https://ui-avatars.com/api/?name=M&background=random&color=fff&size=128",
	},
	{
		username: "GamerPro",
		email: "gamer@example.com",
		password: "Pass123",
		avatar:
			"https://ui-avatars.com/api/?name=G&background=random&color=fff&size=128",
	},
	{
		username: "NewsDaily",
		email: "news@example.com",
		password: "Pass123",
		avatar:
			"https://ui-avatars.com/api/?name=N&background=random&color=fff&size=128",
	},
	{
		username: "SportsFan",
		email: "sports@example.com",
		password: "Pass123",
		avatar:
			"https://ui-avatars.com/api/?name=S&background=random&color=fff&size=128",
	},
];

const channels = [
	{
		channelName: "Tech Academy",
		handle: "@techacademy",
		description:
			"Learn programming, web development, and software engineering.",
		subscribers: 245000,
		ownerIndex: 0,
	},
	{
		channelName: "Chill Music",
		handle: "@chillmusic",
		description: "Relaxing music for study, work, and meditation.",
		subscribers: 890000,
		ownerIndex: 1,
	},
	{
		channelName: "Epic Gaming",
		handle: "@epicgaming",
		description: "Game reviews, walkthroughs, and live streams.",
		subscribers: 1200000,
		ownerIndex: 2,
	},
	{
		channelName: "World News Today",
		handle: "@worldnewstoday",
		description: "Breaking news and in-depth analysis from around the world.",
		subscribers: 3500000,
		ownerIndex: 3,
	},
	{
		channelName: "Sports Central",
		handle: "@sportscentral",
		description: "Highlights, analysis, and everything sports.",
		subscribers: 670000,
		ownerIndex: 4,
	},
	{
		channelName: "Code With Tim",
		handle: "@codewithtim",
		description: "Bite-sized coding tutorials and tips.",
		subscribers: 150000,
		ownerIndex: 0,
	},
];

const videos = [
	// Education (channelIndex 0 - Tech Academy, 5 - Code With Tim)
	{
		title: "React Hooks Explained in 15 Minutes",
		thumbnailUrl: "https://picsum.photos/id/180/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/4298114/",
		description:
			"Master useState, useEffect, useContext and custom hooks with practical examples. Perfect for beginners who want to level up their React skills quickly.",
		category: "Education",
		channelIndex: 0,
		views: 342500,
	},
	{
		title: "Build a REST API with Node.js & Express - Full Course",
		thumbnailUrl: "https://picsum.photos/id/0/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/12896413/",
		description:
			"Complete beginner-friendly guide to building RESTful APIs. Covers Express, MongoDB, authentication with JWT, and deployment.",
		category: "Education",
		channelIndex: 0,
		views: 185000,
	},
	{
		title: "MongoDB Crash Course 2024",
		thumbnailUrl:
			"https://plus.unsplash.com/premium_photo-1661901004198-0771cc6d5a53?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29tYW4lMjB0ZWFjaGluZ3xlbnwwfHwwfHx8MA%3D%3D",
		videoUrl: "https://www.pexels.com/download/video/31887618/",
		description:
			"Everything you need to know about MongoDB - from installation to advanced queries, indexing, and aggregation pipelines.",
		category: "Education",
		channelIndex: 5,
		views: 98700,
	},
	{
		title: "CSS Grid vs Flexbox - When to Use What",
		thumbnailUrl:
			"https://atyantik.com/wp-content/uploads/2025/03/flexbox-vs-grid.jpg",
		videoUrl: "https://www.pexels.com/download/video/31887618/",
		description:
			"Stop guessing! Learn the key differences between CSS Grid and Flexbox and when to use each layout method.",
		category: "Education",
		channelIndex: 5,
		views: 127000,
	},

	// Entertainment (channelIndex 1 - Chill Music)
	{
		title: "Empire of the Sun",
		thumbnailUrl: "https://picsum.photos/id/433/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/31887618/",
		description:
			"24/7 lofi hip hop radio. Perfect background music for studying, working, or just chilling. Enjoy the vibes!",
		category: "Music",
		channelIndex: 1,
		views: 4500000,
	},
	{
		title: "Top 10 Movie Soundtracks of All Time",
		thumbnailUrl: "https://picsum.photos/id/1040/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/31887618/",
		description:
			"A journey through the most iconic movie soundtracks ever created. From Hans Zimmer to John Williams.",
		category: "Entertainment",
		channelIndex: 1,
		views: 672000,
	},
	{
		title: "Acoustic Covers of Popular Songs 2024",
		thumbnailUrl: "https://picsum.photos/id/823/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/31887618/",
		description:
			"Beautiful acoustic renditions of today's biggest hits. Grab your headphones and enjoy.",
		category: "Music",
		channelIndex: 1,
		views: 1230000,
	},

	// Gaming (channelIndex 2 - Epic Gaming)
	{
		title: "GTA VI First Look - Everything We Know",
		thumbnailUrl: "https://picsum.photos/id/1011/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/31887618/",
		description:
			"Breaking down the GTA VI trailer frame by frame. Release date rumors, map analysis, and new gameplay features revealed.",
		category: "Gaming",
		channelIndex: 2,
		views: 8900000,
	},
	{
		title: "Minecraft But Everything is Multiplied x100",
		thumbnailUrl: "https://picsum.photos/id/1040/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/9068460/",
		description:
			"What happens when every block, every mob, and every drop is multiplied by 100? Absolute chaos.",
		category: "Gaming",
		channelIndex: 2,
		views: 2340000,
	},
	{
		title: "Pro Tips to Improve Your Aim in Valorant",
		thumbnailUrl: "https://picsum.photos/id/1060/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/4982352/",
		description:
			"Radiant player shares crosshair placement, sensitivity settings, and training routines to improve your aim.",
		category: "Gaming",
		channelIndex: 2,
		views: 560000,
	},

	// News (channelIndex 3 - World News Today)
	{
		title: "AI Revolution: How It's Changing Every Industry",
		thumbnailUrl: "https://picsum.photos/id/119/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/8087323/",
		description:
			"From healthcare to finance, artificial intelligence is transforming the way we live and work. An in-depth analysis.",
		category: "News",
		channelIndex: 3,
		views: 1560000,
	},
	{
		title: "Space Exploration Update - Mars Mission 2026",
		thumbnailUrl: "https://picsum.photos/id/903/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/7615679/",
		description:
			"Latest updates on the upcoming Mars mission. New discoveries, launch timelines, and what it means for humanity.",
		category: "News",
		channelIndex: 3,
		views: 890000,
	},
	{
		title: "Global Climate Summit - Key Takeaways",
		thumbnailUrl: "https://picsum.photos/id/29/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/7592165/",
		description:
			"Breaking down the most important decisions from this year's climate summit and their impact on environmental policy.",
		category: "News",
		channelIndex: 3,
		views: 345000,
	},

	// Sports (channelIndex 4 - Sports Central)
	{
		title: "Champions League Final Highlights 2025",
		thumbnailUrl: "https://picsum.photos/id/366/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/8695148/",
		description:
			"All the goals, drama, and unforgettable moments from this year's Champions League Final.",
		category: "Sports",
		channelIndex: 4,
		views: 12500000,
	},
	{
		title: "Top 10 Goals of the Season",
		thumbnailUrl: "https://picsum.photos/id/287/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/8053646/",
		description:
			"Counting down the most spectacular goals scored across all major leagues this season.",
		category: "Sports",
		channelIndex: 4,
		views: 3200000,
	},

	// Technology (channelIndex 0 - Tech Academy)
	{
		title: "iPhone 17 Pro Review - Worth the Upgrade?",
		thumbnailUrl: "https://picsum.photos/id/160/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/28646608/",
		description:
			"Full review of the iPhone 17 Pro after 2 weeks of daily use. Camera tests, battery life, and performance benchmarks.",
		category: "Technology",
		channelIndex: 0,
		views: 4200000,
	},
	{
		title: "Best Mechanical Keyboards for Developers 2025",
		thumbnailUrl: "https://picsum.photos/id/201/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/4359114/",
		description:
			"Comparing the top mechanical keyboards for programming. From budget picks to premium options.",
		category: "Technology",
		channelIndex: 0,
		views: 287000,
	},
	{
		title: "Linux vs Windows vs macOS for Programming",
		thumbnailUrl: "https://picsum.photos/id/20/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/36418632/",
		description:
			"Which operating system is best for developers in 2025? We compare performance, tooling, and developer experience.",
		category: "Technology",
		channelIndex: 5,
		views: 965000,
	},

	// Other
	{
		title: "How to Stay Productive Working From Home",
		thumbnailUrl: "https://picsum.photos/id/1067/640/360.jpg",
		videoUrl: "https://www.pexels.com/download/video/8456404/",
		description:
			"Practical tips and routines to stay focused and productive while working remotely. Desk setup and time management included.",
		category: "Other",
		channelIndex: 5,
		views: 430000,
	},
];

async function seed() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("Connected to MongoDB");

		// Clear existing data
		await Video.deleteMany({});
		await Channel.deleteMany({});
		await User.deleteMany({});
		console.log("Cleared existing data");

		// Create users
		const createdUsers = await User.create(users);
		console.log(`Created ${createdUsers.length} users`);

		// Create channels with owner references
		const channelDocs = channels.map((ch) => ({
			channelName: ch.channelName,
			handle: ch.handle,
			description: ch.description,
			subscribers: ch.subscribers,
			owner: createdUsers[ch.ownerIndex]._id,
		}));
		const createdChannels = await Channel.create(channelDocs);
		console.log(`Created ${createdChannels.length} channels`);

		// Link channels back to users
		for (const ch of channels) {
			const channelDoc = createdChannels.find(
				(c) => c.channelName === ch.channelName,
			);
			await User.findByIdAndUpdate(createdUsers[ch.ownerIndex]._id, {
				$addToSet: { channels: channelDoc._id },
			});
		}

		// Create videos
		const videoDocs = videos.map((v) => ({
			title: v.title,
			thumbnailUrl: v.thumbnailUrl,
			videoUrl: v.videoUrl,
			description: v.description,
			category: v.category,
			channelId: createdChannels[v.channelIndex]._id,
			uploader: createdChannels[v.channelIndex].owner,
			views: v.views,
		}));
		const createdVideos = await Video.create(videoDocs);
		console.log(`Created ${createdVideos.length} videos`);

		// Link videos back to channels
		for (const video of createdVideos) {
			await Channel.findByIdAndUpdate(video.channelId, {
				$push: { videos: video._id },
			});
		}

		console.log("\nSeed complete! Summary:");
		console.log(`  Users:    ${createdUsers.length}`);
		console.log(`  Channels: ${createdChannels.length}`);
		console.log(`  Videos:   ${createdVideos.length}`);
		console.log("\nAll users have password: Pass123");
		console.log("You can login with any email, e.g. tim@example.com / Pass123");
	} catch (error) {
		console.error("Seed failed:", error);
	} finally {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	}
}

seed();
