import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // If using mongoose v6, no need for useCreateIndex.
    } as mongoose.ConnectOptions
  )
  .then(() => console.log("MongoDB connected"))
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
