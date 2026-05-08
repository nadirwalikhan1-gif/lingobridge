# LingoBridge

Professional real-time interpreter booking and call platform.

## Monorepo structure

```
lingobridge/
├── client/          # React + Vite + Tailwind frontend
└── server/          # Node.js + Express + Socket.IO backend
```

## Quick start

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Environment variables

```bash
# Backend
cp server/.env.example server/.env
# Fill in real values (see .env.example for descriptions)

# Frontend
cp client/.env.example client/.env
# Fill in real values
```

### 3. Run in development

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Backend runs on `http://localhost:3001`
Frontend runs on `https://localhost:5174`

## Deployment

- **Backend**: Deploy `server/` to Render, Railway, or Fly.io
- **Frontend**: Deploy `client/` to Vercel or Netlify (set env vars in dashboard)

## Security notes

- Never commit `.env` files
- Rotate secrets immediately if they are ever exposed
- See `server/.env.example` for all required variables

