# YouTube Clone (MERN Stack)

A full-stack YouTube clone application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

- Browse and watch videos
- Search and filter content
- Like/dislike videos
- Add, edit, delete comments
- Create and manage channels
- User authentication (JWT)

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 📁 Project Structure

```
YoutubeClone/
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install backend dependencies:

   ```bash
   cd Backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd Frontend
   npm install
   ```

4. Set up backend environment variables:

   ```bash
   cd Backend
   cp .env.example .env
   ```

   If you are on Windows PowerShell, use:

   ```powershell
   cd Backend
   Copy-Item .env.example .env
   ```

5. Update `Backend/.env` with your values:
   - `PORT` - Backend server port (example: `8000`)
   - `FRONTEND_URL` - Frontend origin for CORS (example: `http://localhost:5173`)
   - `MONGODB_URI` - MongoDB connection URI
   - `JWT_SECRET` - Secret key used to sign JWTs
   - `JWT_EXPIRES_IN` - Token expiry (example: `7d`)

6. Seed the database (recommended before first run):

   ```bash
   cd Backend
   npm run seed
   ```

7. Start the backend server:

   ```bash
   cd Backend
   npm run dev
   ```

8. Start the frontend development server:

   ```bash
   cd Frontend
   npm run dev
   ```

### Run Order (Quick Reference)

1. Start MongoDB
2. Configure `Backend/.env`
3. Run `npm run seed` inside `Backend`
4. Run `npm run dev` inside `Backend`
5. Run `npm run dev` inside `Frontend`

## 🌐 API Endpoints

### Authentication

- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get current user profile (auth required)

### Videos

- `GET /api/videos` - Get all videos (public)
- `GET /api/videos/:id` - Get a single video (public)
- `GET /api/videos/search?q=...` - Search videos by title (public)
- `GET /api/videos/category/:category` - Filter videos by category (public)
- `POST /api/videos` - Upload video (auth required)
- `PUT /api/videos/:id` - Update video (auth + ownership required)
- `DELETE /api/videos/:id` - Delete video (auth + ownership required)
- `POST /api/videos/:id/like` - Like/unlike a video (auth required)
- `POST /api/videos/:id/dislike` - Dislike/undislike a video (auth required)
- `POST /api/videos/:id/view` - Increment view count (public)

### Comments

- `GET /api/comments/:videoId` - Get video comments (public)
- `POST /api/comments` - Add comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth + ownership required)
- `DELETE /api/comments/:id` - Delete comment (auth + ownership required)

### Channels

- `GET /api/channels` - Get all channels (auth required)
- `GET /api/channels/:id` - Get channel details (public)
- `POST /api/channels` - Create channel (auth required)
- `PUT /api/channels/:id` - Update channel (auth + ownership required)
- `DELETE /api/channels/:id` - Delete channel (auth + ownership required)
- `GET /api/channels/:channelId/videos` - Get videos for a channel (public)

## 📱 Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or login
3. Browse videos, upload content, and interact with the community

## 🧪 Test Data (For Evaluator)

Use the following values when testing the Create Video flow. Replace placeholders with working links before submission.

- Thumbnail URL 1: `https://www.w3schools.com/html/pic_trulli.jpg`
- Video URL 1: `https://www.w3schools.com/html/mov_bbb.mp4`
