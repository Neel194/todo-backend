import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from '../src/routes/user.route';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(globalErrorHandler);

// MongoDB database connect and server start
connectDB().then(() => {
    app.listen(process.env.PORT, () =>
        console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
    );
});
