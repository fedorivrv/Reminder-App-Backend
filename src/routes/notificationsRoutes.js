import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { Subscription } from "../models/subscription.js";

const router = Router();

// POST /notifications/subscribe
router.post("/notifications/subscribe", authenticate, async (req, res) => {
  const subscription = req.body;

  await Subscription.findOneAndUpdate(
    {
      userId: req.user._id,
      endpoint: subscription.endpoint,
    },
    {
      userId: req.user._id,
      ...subscription,
    },
    { upsert: true, new: true }
  );

  res.status(201).json({ message: "Subscribed successfully" });
});

export default router;
