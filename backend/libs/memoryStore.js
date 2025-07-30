// Simple in-memory storage for demo purposes
let users = new Map();
let verificationCodes = new Map();

export const memoryStore = {
  // User operations
  findUserByEmail: (email) => {
    return users.get(email) || null;
  },
  
  saveUser: (userData) => {
    const user = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      password: userData.password,
      isVerified: false,
      createdAt: new Date()
    };
    users.set(userData.email, user);
    return user;
  },
  
  updateUser: (email, updates) => {
    const user = users.get(email);
    if (user) {
      Object.assign(user, updates);
      users.set(email, user);
      return user;
    }
    return null;
  },
  
  // Verification code operations
  saveVerificationCode: (email, code) => {
    verificationCodes.set(code, {
      email,
      code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
  },
  
  findByVerificationCode: (code) => {
    const verification = verificationCodes.get(code);
    if (verification && verification.expiresAt > new Date()) {
      return verification;
    }
    return null;
  },
  
  removeVerificationCode: (code) => {
    verificationCodes.delete(code);
  }
};
