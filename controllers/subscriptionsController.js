import Stripe from "stripe";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const renderPricing = (req, res) => {
  res.render("plan", {
    title: "pricing - Url shortener",
  });
};

const renderInvoices = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  if (!currentUser) {
    return next(new AppError("user not found, please login first", 401));
  }

  const invoices = await stripe.invoices.list({
    customer: currentUser.stripeCustomerId,
    limit: 10,
  });

  const formattedInvoices = invoices.data.map((invoice) => ({
    id: invoice.id,
    amount_due: invoice.amount_due / 100, // convert to rupees
    currency: invoice.currency.toUpperCase(),
    created: new Date(invoice.created * 1000).toLocaleDateString(),
    status: invoice.status,
    invoice_pdf: invoice.invoice_pdf,
  }));

  res.status(200).render("invoice", {
    title: "My Invoices",
    invoices: formattedInvoices,
  });
});

export { renderPricing, renderInvoices };
