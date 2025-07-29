import express from "express";
import mongoose from "mongoose";

const connectDB = async (req,res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    
  }
}

export default connectDB;