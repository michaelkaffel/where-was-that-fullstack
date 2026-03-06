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
- CORS (whitelist-based configuration)  
- HTTPS (self-signed SSL for local development)

### Development Environment
- MongoDB (local via Homebrew) 
- MongoDB Atlas
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
│   ├── bin/       # HTTPS server entry + SSL certs (not tracked)
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

## 🔧 Environment Setup (Required)

Create a `.env` file inside `/server` based on `.env.example`:

```
PNODE_ENV=development
# environments: hotspot, development

PORT=3001

MONGO_ATLAS=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
MONGO_HOTSPOT=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

CLIENT_URL=http://localhost:<port>

SECRET_KEY=your_jwt_secret_here

SSL_KEY_PATH=./bin/server.key
SSL_CERT_PATH=./bin/server.cert

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

> SSL files are intentionally excluded from version control.

---

## 🔒 Generate SSL Certificate (Required for HTTPS)

From the `/server/bin` directory:

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Press Enter through prompts and use:

```
Common Name (CN): localhost
```

This generates:

```
server.key
server.cert
```

These files are required for HTTPS and must exist before starting the backend.

---

## 🌐 CORS Configuration

The backend uses a whitelist-based CORS configuration.

Allowed origin (local development):

```
http://localhost:3000
```

This allows secure communication between:

- Frontend: `http://localhost:3000`
- Backend: `https://localhost:3444`

---

## 🚀 Running Locally

### 1️⃣ Start MongoDB

If using Homebrew:

```
brew services start mongodb-community@8.0
```

---

### 2️⃣ Start Backend (HTTPS)

```
cd server
npm install
npm start
```

Backend runs on:

```
https://localhost:3444
```

> You may need to accept the self-signed certificate warning in your browser.

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
- Uploaded images are automatically deleted when their associated place or user is deleted
- File upload size limit: 10MB

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
- HTTPS enabled for local secure development
- CORS configured via whitelist for controlled frontend access

---

## 📌 Future Improvements

- Cloud image storage (Cloudinary / Firebase Storage)
- Production-grade SSL termination (Nginx / Render / Fly.io)
- Deployment pipeline
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
