import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import { ENV } from './config/env.js';

import authRoutes from '../src/routes/auth.route.js';

const app = express();
const PORT = ENV.PORT;

// Middleware for CORS
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);


// test route
app.get('/', (req, res) => {
    res.send('Hello khaled hussein');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
