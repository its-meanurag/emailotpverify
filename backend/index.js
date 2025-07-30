import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import AuthRouter from './routes/Authroute.js';

const app = express();
dotenv.config();

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use('/auth', AuthRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Email OTP Service - Demo Mode');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Demo Mode: OTP codes will be logged to console`);
});
