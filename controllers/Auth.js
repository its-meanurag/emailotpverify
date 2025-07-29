import { sendVerificationEmail, sendWelcomeEmail } from "../middleware/Email.js";
import { generateTokenAndSetCookies } from "../middleware/GenerateToken.js";
import { UserModel } from "../modals/user.js";
import bcryptjs from 'bcryptjs';

const Register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please log in." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new UserModel({
      email,
      password: hashedPassword,
      name,
      verificationCode,
    });

    await user.save();
   
    await sendVerificationEmail(user.email, verificationCode);

    return res.status(200).json({ success: true, message: "User registered successfully", user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({
      verificationCode: code,
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { Register, VerifyEmail };
