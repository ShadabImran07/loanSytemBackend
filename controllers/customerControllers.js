import prisma from "../DB/db.config.js";
import {
	creditScoreCheck,
	checkLoanEligibility,
} from "../utils/creditScorex.js";

const createCustomer = async (req, res) => {
	try {
		const { first_name, last_name, phone_number, monthly_salary, age } =
			req.body;
		const approvedLimit = Math.round((36 * monthly_salary) / 100000) * 100000;
		const result = await prisma.customer.create({
			data: {
				first_name: first_name,
				last_name: last_name,
				phone_number: phone_number,
				age: age,
				monthly_salary: monthly_salary,
				approved_limit: approvedLimit,
			},
		});
		res.status(201).json(result);
	} catch (err) {
		console.error("Error in registering customer:", err);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const checkEligb = async (req, res) => {
	try {
		const { customer_id, loan_amount, interest_rate, tenure } = req.body;
		const result = await prisma.customer.findUnique({
			where: {
				customer_id: customer_id,
			},
			include: {
				loans: true, // Include associated loans for the customer
			},
		});
		const creditScore = await creditScoreCheck(result);
		const currentEmI = (loan_amount * (1 + interest_rate / 100)) / tenure;

		const data = checkLoanEligibility(
			customer_id,
			creditScore,
			loan_amount,
			interest_rate,
			tenure,
			result.monthly_salary,
			currentEmI
		);
		res.status(201).json(data);
	} catch (error) {
		console.error("Error in checking loan eligbility:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const createLoan = async (req, res) => {
	try {
		const { customer_id, loan_amount, interest_rate, tenure } = req.body;
		const currentEmI = (loan_amount * (1 + interest_rate / 100)) / tenure;
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + tenure);
		const result = await prisma.loan.create({
			data: {
				loan_amount: loan_amount,
				tenure: tenure,
				interest_rate: interest_rate,
				monthly_repayment: currentEmI,
				emis_paid_ontime: 0,
				start_date: startDate,
				end_date: endDate,
				customer_id: customer_id,
			},
		});
		res.status(201).json(result);
	} catch (error) {
		console.error("Error in creating loan:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const loanDetails = async (req, res) => {
	const loanId = String(req.params.loan_id);

	try {
		const loan = await prisma.loan.findUnique({
			where: { loan_id: loanId },
			include: {
				customer: {
					select: {
						customer_id: true,
						first_name: true,
						last_name: true,
						phone_number: true,
						age: true,
					},
				},
			},
		});

		if (!loan) {
			return res.status(404).json({ message: "Loan not found" });
		}

		const response = {
			loan_id: loan.loan_id,
			customer: loan.customer,
			loan_amount: loan.loan_amount,
			interest_rate: loan.interest_rate,
			monthly_installment: loan.monthly_installment,
			tenure: loan.tenure,
		};

		res.json(response);
	} catch (error) {
		console.error("Error fetching loan details:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const loanPayment = async (req, res) => {
	const customerId = String(req.params.customer_id);
	const loanId = String(req.params.loan_id);
	const { amountPaid } = req.body;

	try {
		const loan = await prisma.loan.findUnique({
			where: {
				loan_id: loanId,
				customer_id: customerId,
			},
		});

		if (!loan) {
			return res
				.status(404)
				.json({ message: "Loan not found for the customer" });
		}

		const {
			loan_amount: principal,
			interest_rate,
			monthly_repayment: monthlyInstallment,
			emis_paid_ontime,
			start_date,
			end_date,
			customer_id,
			tenure,
		} = loan;

		const remainingRepayments = Math.ceil(principal - amountPaid);

		const currentEmI = Math.round(
			(principal * (1 + interest_rate / 100)) / tenure
		);

		const updatedLoan = await prisma.loan.update({
			where: {
				loan_id: loanId,
			},
			data: {
				loan_amount: remainingRepayments,
				tenure: tenure - 1,
				emis_paid_ontime: emis_paid_ontime + 1,
				monthly_repayment: currentEmI,
			},
		});
		console.log(updatedLoan);
		res.status(201).json({ message: "EMI PAID" });
	} catch (error) {
		console.error("Error making payment:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
const loanPaymentView = async (req, res) => {
	const customerId = String(req.params.customer_id);
	const loanId = String(req.params.loan_id);
	try {
		const loan = await prisma.loan.findUnique({
			where: {
				loan_id: loanId,
				customer_id: customerId,
			},
		});

		if (!loan) {
			return res
				.status(404)
				.json({ message: "Loan not found for the customer" });
		}
		// console.log(loan);
		const {
			loan_amount,
			interest_rate,
			monthly_repayment,
			start_date,
			tenure,
			end_date,
			customer_id,
		} = loan;
		res.json({
			loan_id: loanId,
			customer_id: customer_id,
			loan_amount: loan_amount,
			interest_rate: interest_rate,
			monthly_installment: monthly_repayment,
			repayments_left: tenure,
			start_date: start_date,
			end_date: end_date,
		});
	} catch (error) {
		console.error("Error fetching details:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export {
	createCustomer,
	checkEligb,
	createLoan,
	loanDetails,
	loanPayment,
	loanPaymentView,
};
