import e from "express";
import {
  cancel,
  createCheckoutSession,
  getSubscriptionInfo,
  success,
} from "../controllers/stripeController.js";
import { protect } from "../middleware/protect.js";

const router = e.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);

router.get("/success", success);
router.get("/cancel", cancel);

router.get("/user", protect, getSubscriptionInfo);

export default router;
