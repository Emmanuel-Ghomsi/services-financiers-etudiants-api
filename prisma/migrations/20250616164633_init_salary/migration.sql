-- CreateEnum
CREATE TYPE "SalaryPaymentMode" AS ENUM ('BANK_TRANSFER', 'CASH', 'MOBILE_MONEY');

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "grossSalary" DOUBLE PRECISION NOT NULL,
    "deductions" DOUBLE PRECISION NOT NULL,
    "advances" DOUBLE PRECISION NOT NULL,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "paymentMode" "SalaryPaymentMode" NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "payslipUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);
