import express from 'express';
import { Register, VerifyEmail } from '../controllers/Auth.js';

const AuthRouter = express.Router();
AuthRouter.post('/register',Register);
AuthRouter.post('/verifyEmail',VerifyEmail)

export default AuthRouter;