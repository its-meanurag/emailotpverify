import { sendVerificationEmail, sendWelcomeEmail } from "../middleware/Email.js";
import { generateTokenAndSetCookies } from "../middleware/GenerateToken.js";
import { memoryStore } from "../libs/memoryStore.js";
import bcryptjs from 'bcryptjs';

const Register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = memoryStore.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please log in." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = memoryStore.saveUser({
      email,
      password: hashedPassword,
      name
    });

    // Store verification code
    memoryStore.saveVerificationCode(email, verificationCode);

    // For demo purposes, we'll simulate sending email but actually just log the OTP
    console.log(`\n🔥 DEMO MODE: OTP for ${email} is: ${verificationCode}\n`);
    
    // Uncomment the line below if you have email configured
    // await sendVerificationEmail(user.email, verificationCode);

    return res.status(200).json({ 
      success: true, 
      message: "User registered successfully. Check console for OTP in demo mode.", 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const verification = memoryStore.findByVerificationCode(code);

    if (!verification) {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }

    const user = memoryStore.updateUser(verification.email, { isVerified: true });
    memoryStore.removeVerificationCode(code);

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    console.log(`\n✅ Email verified successfully for: ${user.email}\n`);
    
    // Uncomment the line below if you have email configured
    // await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { Register, VerifyEmail };
