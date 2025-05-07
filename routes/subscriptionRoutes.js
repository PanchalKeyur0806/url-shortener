import e from "express";
import {
  cancel,
  createCheckoutSession,
  getSubscriptionInfo,
  success,
} from "../controllers/stripeController.js";
import { protect } from "../middleware/protect.js";
import { checkPurchasedPlan } from "../middleware/checkPurchasedPlan.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = e.Router();

router.post(
  "/create-checkout-session",
  protect,
  restrictTo("user"),
  checkPurchasedPlan,
  createCheckoutSession
);

router.get("/success", restrictTo("user"), success);
router.get("/cancel", restrictTo("user"), cancel);

router.get("/user", protect, restrictTo("user"), getSubscriptionInfo);

export default router;
