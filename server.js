import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {connectDB} from './src/database/db-connect.js';
import sendEmail from './src/utils/send-email.js';

import userRoutes from './src/routes/user.route.js';
import fileRoutes from  './src/routes/file.route.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT;
const HOST = process.env.IP|| '0.0.0.0';
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', fileRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT,HOST, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});