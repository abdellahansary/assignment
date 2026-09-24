import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/assignment7");
    console.log(`MongoDB Connected}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToDatabase;
