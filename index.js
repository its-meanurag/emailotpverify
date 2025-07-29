import express from 'express';
import dotenv from 'dotenv';
import connectDB from './libs/db.js';
import morgan from 'morgan';
import AuthRouter from './routes/Authroute.js';


const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(morgan('dev'));
app.use('/auth',AuthRouter)


app.get('/', (req, res) => {
  res.send('Welcome to the Email OTP Service');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});