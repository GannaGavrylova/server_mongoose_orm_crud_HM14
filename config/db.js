import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectToMyDB = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Database:${connectToMyDB.connection.host}`);
  } catch (error) {
    console.error("Error connected to Database");
    process.exit(1);
  }
};
