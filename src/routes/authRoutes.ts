import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

// Register new user
router.post("/register", async (req: Request, res: Response) => {
  // delete all users for debugging purposes
  // await User.deleteMany({});

  const { email, password } = req.body;

  console.log("new user is registering with these params");
  console.log(`email: ${email} password: ${password}`);

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ token, user: email });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ token, user: email });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth stub endpoint
router.get("/google", (req: Request, res: Response) => {
  res.json({ message: "Google OAuth endpoint not implemented" });
});

export default router;
