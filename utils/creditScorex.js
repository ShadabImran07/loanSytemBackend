const creditScoreCheck = async (customer) => {
	const { loans, approved_limit, monthly_salary } = customer;

	let pastLoansPaidOnTimeScore = 0;
	let numberOfLoansTakenScore = 0;
	let loanActivityInCurrentYearScore = 0;
	let loanApprovedVolumeScore = 0;
	let sumOfCurrentLoans = 0;

	loans.forEach((loan) => {
		if (loan.emis_paid_ontime > 0) {
			pastLoansPaidOnTimeScore++;
		}
		loanActivityInCurrentYearScore +=
			new Date(loan.start_date).getFullYear() === new Date().getFullYear()
				? 1
				: 0;
		loanApprovedVolumeScore += loan.loan_amount;
		sumOfCurrentLoans += loan.loan_amount;
	});

	numberOfLoansTakenScore = loans.length;

	const pastLoansPaidOnTime =
		pastLoansPaidOnTimeScore / numberOfLoansTakenScore;
	const numberOfLoansTaken = numberOfLoansTakenScore / 5;
	const loanActivityInCurrentYear =
		loanActivityInCurrentYearScore / numberOfLoansTakenScore;
	const loanApprovedVolume = loanApprovedVolumeScore / (approved_limit * 1.5);
	const sumOfCurrentLoansVsApprovedLimit =
		sumOfCurrentLoans > approved_limit ? 0 : 1;

	let creditScore =
		(0.3 * pastLoansPaidOnTime +
			0.2 * numberOfLoansTaken +
			0.1 * loanActivityInCurrentYear +
			0.2 * loanApprovedVolume +
			0.2 * sumOfCurrentLoansVsApprovedLimit) *
		100;

	const sumOfEMIs = loans.reduce(
		(total, loan) => total + loan.monthly_repayment,
		0
	);
	if (sumOfEMIs > monthly_salary * 0.5) {
		creditScore = 0;
	}

	creditScore = Math.min(100, Math.max(0, creditScore));

	return Math.round(creditScore);
};

const checkLoanEligibility = (
	customer_id,
	creditScore,
	loan_amount,
	interest_rate,
	tenure,
	monthly_salary,
	currentEMIs
) => {
	let canApproveLoan = false;
	let corrected_interest_rate = interest_rate;

	if (creditScore > 50) {
		canApproveLoan = true;
	} else if (50 >= creditScore && creditScore > 30) {
		if (interest_rate <= 12) {
			corrected_interest_rate = 12;
			canApproveLoan = true;
		}
	} else if (30 >= creditScore && creditScore > 10) {
		if (interest_rate <= 16) {
			corrected_interest_rate = 16;
			canApproveLoan = true;
		}
	}

	const totalEMItoSalaryRatio = currentEMIs / monthly_salary;

	if (creditScore <= 10 || totalEMItoSalaryRatio > 0.5) {
		canApproveLoan = false;
	}

	return {
		customer_id,
		approval: canApproveLoan,
		interest_rate: corrected_interest_rate,
		corrected_interest_rate,
		tenure,
		monthly_installment: (loan_amount * (1 + interest_rate / 100)) / tenure,
	};
};

export { creditScoreCheck, checkLoanEligibility };
