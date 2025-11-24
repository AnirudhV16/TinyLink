# 🔗 TinyLink - URL Shortener

A full-stack URL shortener built with React, Express, and PostgreSQL. Create short, shareable links with custom codes and track click statistics.

![TinyLink Demo](https://img.shields.io/badge/status-live-success)

## 🌟 Features

- ✨ **Instant URL Shortening** - Convert long URLs into short, memorable links
- 🎯 **Custom Codes** - Create branded short links with custom codes (6-8 characters)
- 📊 **Click Analytics** - Track total clicks and last click timestamps
- 🔍 **Search & Filter** - Easily find links by code or URL
- ⚡ **Fast & Reliable** - Built on modern tech stack with serverless deployment

## 🚀 Live Demo

- **Frontend**: [https://tiny-link-front.vercel.app](https://tiny-link-front.vercel.app)
- **Backend API**: [https://tiny-link-back.vercel.app](https://tiny-link-back.vercel.app)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Express 5** - Node.js web framework
- **PostgreSQL** - Robust relational database (Neon)
- **Node.js** - JavaScript runtime
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Serverless deployment platform for both frontend and backend
- **Neon** - Serverless PostgreSQL database

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or Neon account)
- **Git**

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tinylink.git
cd tinylink
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
BASE_URL=http://localhost:3000
PORT=3000
```

Initialize the database:
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_clicked_at TIMESTAMP
);

CREATE INDEX idx_code ON links(code);
```

Start the backend:
```bash
npm run dev
```

Backend will run at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_BASE_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

## 🌐 API Endpoints

### Base URL
```
Local: http://localhost:3000
Production: https://tiny-link-back.vercel.app
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/healthz` | Health check |
| `POST` | `/api/links` | Create new short link |
| `GET` | `/api/links` | Get all links |
| `GET` | `/api/links/:code` | Get link stats |
| `DELETE` | `/api/links/:code` | Delete a link |
| `GET` | `/:code` | Redirect to target URL |

### Example: Create Short Link

**Request:**
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://example.com/very/long/url",
    "code": "ex123"
  }'
```

**Response:**
```json
{
  "id": 1,
  "code": "ex123",
  "target_url": "https://example.com/very/long/url",
  "total_clicks": 0,
  "created_at": "2025-01-10T12:00:00.000Z",
  "last_clicked_at": null
}
```

## 🚢 Deployment

### Deploy to Vercel

#### Backend Deployment

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `BASE_URL` - Your frontend URL (e.g., `https://tiny-link-front.vercel.app`)
4. Deploy!

#### Frontend Deployment

1. Import frontend project in Vercel
2. Configure environment variables:
   - `VITE_API_URL` - Your backend URL (e.g., `https://tiny-link-back.vercel.app`)
   - `VITE_BASE_URL` - Your frontend URL (e.g., `https://tiny-link-front.vercel.app`)
3. Deploy!

### Environment Variables

#### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
BASE_URL=https://tiny-link-front.vercel.app
PORT=3000
```

#### Frontend (`.env`)
```env
VITE_API_URL=https://tiny-link-back.vercel.app
VITE_BASE_URL=https://tiny-link-front.vercel.app
```

## 📁 Project Structure

```
tinylink/
├── backend/
│   ├── api/
│   │   └── index.js          # Express server entry
│   ├── src/
│   │   ├── db.js             # Database connection
│   │   ├── routes.js         # API routes
│   │   └── utils.js          # Utility functions
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Header.jsx
│   │   │   └── StatsPage.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── README.md
```

## 🎨 Features Walkthrough

### Create Short Links
1. Click "Add Link" button on dashboard
2. Enter target URL (required)
3. Optionally add custom code (6-8 alphanumeric characters)
4. Click "Create Short Link"

### View Statistics
- Click on any short code in the dashboard
- View detailed stats: clicks, creation date, last clicked time
- Copy short URL with one click

### Manage Links
- Search links by code or URL
- Delete links when no longer needed
- Copy short URLs to clipboard

## 🔧 Configuration

### Custom Code Rules
- Length: 6-8 characters
- Allowed: Letters (a-z, A-Z) and numbers (0-9)
- Auto-generated if not provided

### CORS Configuration
Update `backend/api/index.js` to allow your domains:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
};
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend CORS includes your frontend URL
- Check that environment variables are set correctly

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if Neon DB allows connections from your IP/Vercel
- Ensure database table is created

### Environment Variables Not Loading
- Vite requires `VITE_` prefix for frontend env vars
- Restart dev server after changing .env files
- Check Vercel dashboard for production env vars

## 📧 Contact

Anirudh - [vennapusaani1629@gmail.com](mailto:vennapusaani1629@gmail.com)


