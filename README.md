# 🏔 Where Was That?

A full-stack MERN application for tracking personal outdoor locations — campsites, hikes, overlooks — and leaving private notes about changing conditions over time.

**Live at:** [where-was-that-place.web.app](https://where-was-that-place.web.app)

Users can:

- Create their own places with photos
- Add unlimited private notes to each place
- Track favorites
- Pin locations on an interactive map
- Sign in with username/password or Google OAuth
- Manage their own collection securely

---

## 🧱 Tech Stack

### Frontend
- React
- Redux Toolkit (async thunks)
- React Router
- Leaflet (interactive maps)
- Formik (form validation)
- Firebase Hosting

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication
- Passport Local + Google OAuth
- Multer (image uploads)
- Google Cloud Storage (image hosting)
- Google Cloud Functions (serverless deployment)

### Development Environment
- macOS + zsh
- HTTPS local dev server (self-signed SSL)
- MongoDB local via Homebrew
- Git + GitHub

---

## 📁 Project Structure

```
where-was-that-fullstack/
│
├── client/                # React frontend
│   ├── src/
│   ├── .env               # Local dev config
│   ├── .env.production     # Production config
│   ├── firebase.json       # Firebase Hosting config
│   └── .firebaserc
│
├── server/                # Express backend
│   ├── bin/               # HTTPS server entry + SSL certs (not tracked)
│   ├── models/            # Mongoose schemas (User, Place with embedded Notes)
│   ├── routes/            # Express routers (users, places, cors)
│   ├── gcs.js             # Google Cloud Storage upload/delete helpers
│   ├── index.js           # Cloud Functions entry point
│   ├── app.js             # Express app configuration
│   ├── authenticate.js    # Passport strategies + JWT helpers
│   ├── middleware.js       # res.api(), loadPlace, verifyPlaceOwner
│   └── cors.json          # GCS bucket CORS config
│
├── docs/                  # Project reference documents
│
└── README.md
```

---

## 🌐 Production Architecture

```
Browser → Firebase Hosting (React SPA)
            ↓ API calls
       Google Cloud Functions (Express)
            ↓                ↓
      MongoDB Atlas    Google Cloud Storage
      (data)           (images)
```

- **Frontend:** Firebase Hosting at `where-was-that-place.web.app`
- **Backend:** Cloud Functions at `us-central1-where-was-that-490000.cloudfunctions.net/whereWasThatServer`
- **Database:** MongoDB Atlas
- **Images:** GCS bucket `where-was-that-images` (publicly readable)

---

## 🔐 Authentication

- JWT-based authentication with 1-hour token expiry
- Passport Local for username/password login
- Google OAuth 2.0 with automatic account linking
- Ownership enforced server-side — users only see and modify their own data
- Protected routes require Bearer token in Authorization header

---

## 🗂 Database Structure

```
User
 └── owns → Places
              └── contains → Notes (embedded subdocuments)
```

Notes are embedded inside each place document and are not shared between users. Deleting a user cascades to delete all their places and associated GCS images.

---

## 🛣 API Routes

### Auth
```
POST    /users/signup
POST    /users/login
GET     /users/auth/google
GET     /users/auth/google/callback
GET     /users/me
PATCH   /users/me
DELETE  /users/me
GET     /users/logout
```

### Places
```
GET     /places
POST    /places              (multipart/form-data with image)
GET     /places/:placeId
PATCH   /places/:placeId     (favorite toggle)
DELETE  /places/:placeId
```

### Notes (embedded in Place)
```
GET     /places/:placeId/notes
POST    /places/:placeId/notes
GET     /places/:placeId/notes/:noteId
PATCH   /places/:placeId/notes/:noteId
DELETE  /places/:placeId/notes/:noteId
```

All routes except signup, login, and Google OAuth require authentication.

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js
- MongoDB (local via Homebrew or Atlas)
- Google Cloud credentials (for GCS image uploads)

### 1. Environment Variables

Create `server/.env` based on `.env.example`:

```
NODE_ENV=development
PORT=3001
MONGO_ATLAS=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
CLIENT_URL=http://localhost:3000
SECRET_KEY=your_jwt_secret_here
SSL_KEY_PATH=./bin/server.key
SSL_CERT_PATH=./bin/server.cert
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://localhost:3444/users/auth/google/callback
GCS_BUCKET_NAME=your_gcs_bucket_name
GOOGLE_APPLICATION_CREDENTIALS=./gcs-key.json
```

Create `client/.env`:

```
REACT_APP_API_URL=https://localhost:3444
```

### 2. Generate SSL Certificate

From `server/bin/`:

```bash
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Use `localhost` as the Common Name. These files are required for HTTPS and are excluded from version control.

### 3. Start Backend

```bash
cd server
npm install
npm start
```

Runs on `https://localhost:3444`

### 4. Start Frontend

```bash
cd client
npm install
npm start
```

Runs on `http://localhost:3000`

---

## 📸 Image Handling

- Images uploaded via Multer with memory storage
- Stored in Google Cloud Storage bucket (publicly readable)
- Automatic cleanup: deleting a place or user removes associated images from GCS
- File types: JPEG, PNG, WebP
- Size limit: 10MB

---

## 🧠 Architecture Decisions

- Notes embedded in Place documents (not separate collection)
- Ownership enforced server-side — client never fetches entire database
- Cloud Functions required middleware adaptations for pre-parsed request bodies, query strings, and multipart uploads
- `res.api()` response helper standardizes all JSON responses with `_id` → `id` normalization
- Google OAuth uses absolute callback URL to handle Cloud Functions path prefix

---

## 📄 License

MIT

---

## 👤 Author

Michael Kaffel