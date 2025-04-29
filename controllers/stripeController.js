import Stripe from "stripe";
import dotenv from "dotenv";
import { Plan } from "../models/planModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { log } from "console";

dotenv.config({ path: "./config.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const plan = req.query.plan;

  if (!plan) {
    return next(new AppError("subscription plan not found"));
  }

  let priceId;
  switch (plan.toLowerCase()) {
    case "monthly":
      priceId = "price_1RHNXoCEBeUXy0V2y9tQckfz";
      break;

    case "yearly":
      priceId = "price_1RHNYYCEBeUXy0V2cEdEoNV0";
      break;

    default:
      break;
  }

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
        price: priceId,
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

// get information about purchased the items of users
const getSubscriptionInfo = catchAsync(async (req, res, next) => {
  const currentUser = req.user.stripeCustomerId;

  if (!currentUser) {
    return next(new AppError("please login and try again", 403));
  }

  const portalSessions = await stripe.billingPortal.sessions.create({
    customer: currentUser,
    return_url: `${req.protocol}://${req.get("host")}/`,
  });

  res.redirect(portalSessions.url);
});

// check the webhook
const stripeWebhook = catchAsync(async (req, res, next) => {
  // get the signature form the headers
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

  // check that event is completed or not
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // find the user
    const user = await User.findOne({ email: session.customer_email });
    if (!user) {
      return next(
        new AppError(`No user found with email ${session.customer_email}`, 404)
      );
    }

    // finding the monthly plan and yearly plan
    const monthlyPlan = await Plan.findOne({ name: "monthly" });
    const yearlyPlan = await Plan.findOne({ name: "yearly" });

    // retrieving the subscription
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    // getting priceId and productId from the subscription variable
    const item = subscription.items.data[0];
    const priceId = item.price.id;
    const productId = item.price.product;

    // declare two variable for setting up duration and plan type
    // EX:- monthly or yearly
    let selectedPlan, durationInDays;

    // check that price id is available
    // if yes then set the variable according to the that plan
    if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
      selectedPlan = monthlyPlan;
      durationInDays = 30;
    } else if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
      selectedPlan = yearlyPlan;
      durationInDays = 365;
    } else {
      return next(new AppError("Invalid price id received", 400));
    }

    // getting todays date and end date of the plan
    const now = new Date();
    const end = new Date(now);
    end.setDate(now.getDate() + durationInDays);

    // storing the user
    user.plan = selectedPlan._id;
    user.remainingUrls = selectedPlan.urlLimit;
    user.remainingDays = selectedPlan.durationInDays;
    user.planStartDate = now;
    user.planEndDate = end;
    user.isActive = true;
    // store subscription related fields
    user.stripeCustomerId = session.customer;
    user.stripeSubscriptionId = subscription.id;
    user.stripeSubscriptionStatus = subscription.status;
    // store the product and price in the user
    user.stripeProductId = productId;
    user.stripePriceId = priceId;

    // saving the user
    await user.save();

    // if user subscription automatically canceled
  } else if (event.type === "checkout.subscription.deleted") {
    const subscription = event.data.object;

    const findUser = await User.findOne({
      stripeSubscriptionId: subscription.id,
    });

    if (!findUser) {
      return next(
        new AppError(`no user found with subscription id ${subscription.id}`)
      );
    }

    findUser.stripeSubscriptionStatus = "canceled";

    await findUser.save();

    console.log(`User ${findUser.email}'s subscription canceled successfully.`);
  } else if (event.type === "customer.subscription.updated") {
    // get the subscription info
    const subscription = event.data.object;

    // find the user
    const findUser = await User.findOne({
      stripeSubscriptionId: subscription.id,
    });

    // if user exists then store infor regading the user request
    if (findUser) {
      if (subscription.canceled_at !== null) {
        findUser.stripeSubscriptionStatus = "canceled";
      } else {
        findUser.stripeSubscriptionStatus = "active";
      }
    }

    // save the user
    await findUser.save();
  }
  res.status(200).json({ received: true });
});

export {
  createCheckoutSession,
  stripeWebhook,
  success,
  cancel,
  getSubscriptionInfo,
};
