import e from "express";
import { protect } from "../middleware/protect.js";
import { renderInvoices } from "../controllers/subscriptionsController.js";

const router = e.Router();

router.get("/my-invoices", protect, renderInvoices);

export default router;
