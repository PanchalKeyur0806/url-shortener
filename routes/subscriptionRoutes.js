import e from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createCheckoutSession } from "../controllers/stripeController.js";
import { protect } from "../middleware/protect.js";
import User from "../models/userModel.js";
import { Plan } from "../models/planModel.js"; // if needed

dotenv.config({ path: "./config.env" });

const router = e.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Correct initialization

router.post("/create-checkout-session", protect, createCheckoutSession);

router.post(
  "/webhook",
  e.raw({ type: "application/json" }),
  async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK
      );
    } catch (err) {
      console.log(`❌ Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle successful subscription
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_email;

      const planDurationDays = 30;
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + planDurationDays);

      const plan = await Plan.findOne({ name: "monthly" });

      try {
        await User.findOneAndUpdate(
          { email: customerEmail },
          {
            planStartDate: currentDate,
            planEndDate: endDate,
            remainingDays: planDurationDays,
            isActive: true,
            plan: plan._id,
          }
        );
        console.log(`✅ Subscription started for ${customerEmail}`);
      } catch (updateError) {
        console.error(
          "⚠️ Error updating user after subscription:",
          updateError
        );
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
