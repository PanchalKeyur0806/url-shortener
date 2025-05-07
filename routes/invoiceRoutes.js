import e from "express";
import { protect } from "../middleware/protect.js";
import { renderInvoices } from "../controllers/subscriptionsController.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = e.Router();

router.get("/my-invoices", protect, restrictTo("user"), renderInvoices);

export default router;
