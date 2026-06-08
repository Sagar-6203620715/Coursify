# Coursify — Course Comparator

Full-stack Indian course comparison platform with AI-powered recommendations, admin panel, reviews, and domain chat.

- **Frontend:** React 19 + Vite + Redux Toolkit + Tailwind (deploy on Netlify)
- **Backend:** Express + MongoDB + Socket.IO (deploy on Render)

## Project structure

```
course_comparator/
├── backend/     # Express API
└── frontend/    # React SPA
```

## Local setup

### Backend

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # http://localhost:9000
```

### Frontend

```bash
cd frontend
cp .env.example .env   # VITE_BACKEND_URL=http://localhost:9000
npm install
npm run dev            # http://localhost:3000
```

### Seed database (optional)

```bash
cd backend
npm run seed
```

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 9000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Auth token secret |
| `GEMINI_API_KEY` | Google Gemini API key (AI recommendations) |
| `CLOUDINARY_*` | Image upload credentials |
| `FRONTEND_URL` | Production frontend URL (CORS) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Backend API URL |

## Deployment

### Render (backend)

1. Connect repo, set root directory to `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env vars from `backend/.env.example` (use production values)
5. **Required for AI:** `GEMINI_API_KEY` — copy the same key from your local `.env` into Render → Environment
6. **Required for CORS:** `FRONTEND_URL=https://course-comparator.netlify.app` (or your Netlify URL)

### Netlify (frontend)

1. Connect repo, set base directory to `frontend`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set `VITE_BACKEND_URL` to your Render backend URL

SPA routing is handled via `frontend/public/_redirects`.

## Features

- Browse courses by section (Tech, Skills, School, Competitive Exams)
- Search, filter, and sort courses
- AI Smart Course Finder (Gemini-powered recommendations)
- User auth, reviews, affiliate link tracking
- Admin panel (users, courses, domains, sections)
- Domain chat (Socket.IO)

## Security

Never commit `.env` files. Use `.env.example` as a template. Rotate any keys that were previously committed to git.
