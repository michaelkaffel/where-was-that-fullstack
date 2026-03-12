# Where Was That — Client

React frontend for Where Was That. Deployed to Firebase Hosting.

## Setup

```bash
npm install
npm start
```

Runs on `http://localhost:3000`

## Environment

Create `.env` for local development:

```
REACT_APP_API_URL=https://localhost:3444
```

Production `.env.production` points to the Cloud Functions backend.

## Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```

## Tech

React, Redux Toolkit, React Router, Leaflet, Formik

See the [top-level README](../README.md) for full project documentation.