import Stripe from "stripe";
import dotenv from "dotenv";
import { Plan } from "../models/planModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

dotenv.config({ path: "./config.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  console.log(currentUser);

  const monthlyPlan = await Plan.findOne({ name: "monthly" });
  if (!monthlyPlan) {
    return next(
      new AppError("no monthly plan found, please try again later", 400)
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: "price_1RGwWkCEBeUXy0V2s4ux31Qq",
        quantity: 1,
      },
    ],
    success_url: `${req.protocol}://${req.get(
      "host"
    )}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get("host")}/subscription/cancel`,
    customer_email: currentUser.email,
  });

  res.redirect(303, session.url);
});

export { createCheckoutSession };
