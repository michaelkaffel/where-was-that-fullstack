# 🏔 Where Was That?

A full-stack MERN application for tracking personal outdoor locations — campsites, hikes, overlooks — and leaving private notes about changing conditions over time.

Users can:

- Create their own places
- Upload images
- Add unlimited private notes to each place
- Track favorites
- Manage their own collection securely

This project is structured as a full client/server application with clean separation of concerns and modern backend architecture.

---

## 🧱 Tech Stack

### Frontend
- React
- Redux Toolkit
- Async Thunks
- React Router

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Multer (image uploads)

### Development Environment
- MongoDB (local via Homebrew)
- MongoDB Compass
- Git + GitHub

---

## 📁 Project Structure

```
where-was-that-fullstack/
│
├── client/        # React frontend
│
├── server/        # Express backend
│   ├── models/
│   ├── routes/
│   ├── public/
│   └── app.js
│
└── README.md
```

---

## 🔐 Authentication

- JWT-based authentication
- Protected backend routes
- Ownership enforced at the place level
- Users only see and modify their own data

---

## 🗂 Database Structure (High-Level)

```
User
 └── owns → Places
            └── contains → Notes (embedded subdocuments)
```

Notes are embedded inside each place document and are not shared between users.

---

## 🚀 Running Locally

### 1️⃣ Start MongoDB

If using Homebrew:

```
brew services start mongodb-community@8.0
```

---

### 2️⃣ Start Backend

```
cd server
npm install
npm start
```

Backend runs on:

```
http://localhost:3001
```

---

### 3️⃣ Start Frontend

```
cd client
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 📸 Image Handling

- Images are stored in `server/public/images`
- The database stores relative image URLs
- Images are served statically through Express

---

## 🛣 API Design

### Places
```
GET     /places
POST    /places
GET     /places/:placeId
PATCH   /places/:placeId
DELETE  /places/:placeId
```

### Notes (Embedded in Place)
```
GET     /places/:placeId/notes
POST    /places/:placeId/notes
PATCH   /places/:placeId/notes/:noteId
DELETE  /places/:placeId/notes/:noteId
```

All protected routes require authentication.

---

## 🧠 Architecture Decisions

- MongoDB runs as a system service (not inside project folder)
- Notes are embedded in Place documents
- Ownership is enforced server-side
- Client never fetches entire database
- Backend filters data by authenticated user

---

## 📌 Future Improvements

- Cloud image storage (Cloudinary / Firebase Storage)
- Deployment (Render / Fly.io)
- Search + filtering
- Tagging system
- Map integration

---

## 📄 License

MIT

---

## 👤 Author

Michael Kaffel  
Full-stack development journey project
