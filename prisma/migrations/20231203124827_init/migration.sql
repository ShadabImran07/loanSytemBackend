-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "monthly_salary" DOUBLE PRECISION NOT NULL,
    "approved_limit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "loan_id" TEXT NOT NULL,
    "loan_amount" DOUBLE PRECISION NOT NULL,
    "tenure" INTEGER NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "monthly_repayment" DOUBLE PRECISION NOT NULL,
    "emis_paid_ontime" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("loan_id")
);

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
