import { Router, Request, Response } from "express";
import Event from "../models/Event";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Create a new event
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, description, date, importance } = req.body;
  try {
    const event = new Event({
      title,
      description,
      date,
      importance,
      user: req.user?._id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get events for the authenticated user with optional filters
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { importance, search } = req.query;
  try {
    let filter: any = { user: req.user?._id };
    if (importance) {
      filter.importance = importance;
    }
    if (search) {
      // Example: filtering by title (can be extended to description, etc.)
      filter.title = { $regex: search, $options: "i" };
    }
    const events = await Event.find(filter);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single event by id
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user?._id,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an event
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      req.body,
      { new: true }
    );
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or not authorized" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an event
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const event = await Event.findOneAndDelete({
        _id: req.params.id,
        user: req.user?._id,
      });
      if (!event) {
        return res
          .status(404)
          .json({ message: "Event not found or not authorized" });
      }
      res.json({ message: "Event deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
