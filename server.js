import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './src/database/db-connect.js';
import sendEmail from './src/utils/send-email.js';

import userRoutes from './src/routes/user.route.js';
import fileRoutes from  './src/routes/file.route.js'
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', fileRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});