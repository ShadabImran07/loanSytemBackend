import express from "express";
import {
	createCustomer,
	checkEligb,
	createLoan,
	loanDetails,
	loanPayment,
	loanPaymentView,
} from "../controllers/customerControllers.js";

const router = express.Router();
router.post("/register", createCustomer);

router.post("/check-eligibility", checkEligb);

router.post("/create-loan", createLoan);

router.get("/view-loan/:loan_id", loanDetails);

router.post("/make-payment/:customer_id/:loan_id", loanPayment);
router.get("/view-statement/:customer_id/:loan_id", loanPaymentView);

export default router;
