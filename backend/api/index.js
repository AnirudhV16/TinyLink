import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from '../src/routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup all routes
setupRoutes(app);

// For Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    //console.log("ENV:", process.env.DATABASE_URL);
  });
}