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
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── App.jsx
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

4. Set up environment variables:
   - Copy `Backend/.env.example` to `Backend/.env`
   - Update the MongoDB URI and JWT secret

5. Start the backend server:

   ```bash
   cd Backend
   npm run dev
   ```

6. Start the frontend development server:
   ```bash
   cd Frontend
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Videos

- `GET /videos` - Get all videos
- `POST /videos` - Upload video
- `PUT /videos/:id` - Update video
- `DELETE /videos/:id` - Delete video

### Comments

- `POST /comments` - Add comment
- `GET /comments/:videoId` - Get video comments
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Channels

- `POST /channels` - Create channel
- `GET /channels/:id` - Get channel details

## 📱 Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or login
3. Browse videos, upload content, and interact with the community

## 🤝 Contributing

This project is part of an internship assignment. Please follow the existing code style and commit conventions.

## 📄 License

This project is licensed under the ISC License.
