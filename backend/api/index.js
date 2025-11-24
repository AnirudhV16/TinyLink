import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from '../src/routes.js';

dotenv.config();

const app = express();

// CORS configuration for both local and production
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://tiny-link-front.vercel.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

setupRoutes(app);

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}