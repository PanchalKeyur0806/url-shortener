import Stripe from "stripe";
import dotenv from "dotenv";
import { Plan } from "../models/planModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

dotenv.config({ path: "./config.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const currentUser = req.user;

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
        price: "price_1RHNXoCEBeUXy0V2y9tQckfz",
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

// checking success route of payment
const success = catchAsync(async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id,
    { expand: ["subscription"] }
  );

  res.redirect("/");
});

// cancel route of the payment
const cancel = catchAsync(async (req, res, next) => {
  res.redirect("/");
});

// check the webhook
const stripeWebhook = catchAsync(async (req, res, next) => {
  console.log("Inside the webhook");
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK
    );
  } catch (err) {
    return next(new AppError(`Webhook Error: ${err.message}`, 400));
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const user = await User.findOne({ email: session.customer_email });
    if (!user) {
      return next(
        new AppError(`No user found with email ${session.customer_email}`, 404)
      );
    }

    const plan = await Plan.findOne({ name: "monthly" });
    if (!plan) {
      return next(new AppError("Monthly plan not found", 400));
    }

    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + 30);

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    // storing the user
    user.plan = plan._id;
    user.remainingUrls = plan.totalUrls || 100;
    user.remainingDays = 30;
    user.planStartDate = now;
    user.planEndDate = end;
    user.isActive = true;
    // store subscription related fields
    user.stripeCustomerId = session.customer;
    user.stripeSubcriptionId = session.subscription.id;
    user.stripeSubcriptionStatus = session.subscription.status;
    // store the product and price in the user
    user.stripeProductId = subscription.items.data[0].price.product;
    user.stripePriceId = subscription.items.data[0].price.id;

    await user.save();
  }

  res.status(200).json({ received: true });
});

export { createCheckoutSession, stripeWebhook, success, cancel };
