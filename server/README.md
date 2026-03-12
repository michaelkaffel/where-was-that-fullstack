# Where Was That — Server

Express backend for Where Was That. Deployed to Google Cloud Functions.

## Setup

```bash
npm install
npm start
```

Runs on `https://localhost:3444` (requires SSL cert in `bin/`).

## Environment

Create `.env` based on `.env.example`. Required variables:

```
NODE_ENV, PORT, MONGO_ATLAS, CLIENT_URL, SECRET_KEY,
SSL_KEY_PATH, SSL_CERT_PATH, GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL,
GCS_BUCKET_NAME, GOOGLE_APPLICATION_CREDENTIALS
```

## Deploy

```bash
gcloud functions deploy whereWasThatServer --gen2 --region=us-central1 --runtime=nodejs20 --trigger-http --allow-unauthenticated --source=. --entry-point=whereWasThatServer
```

## Tech

Node.js, Express, MongoDB Atlas, Mongoose, Passport (Local + Google OAuth), JWT, Multer, Google Cloud Storage

See the [top-level README](../README.md) for full project documentation.