/*
  Warnings:

  - The `status` column on the `Leave` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SalaryAdvance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "creatorId" TEXT;

-- AlterTable
ALTER TABLE "Leave" ADD COLUMN     "rejectedReason" TEXT,
ADD COLUMN     "validatedByAdmin" BOOLEAN DEFAULT false,
ADD COLUMN     "validatedBySuperAdmin" BOOLEAN DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" "ValidationStatus" NOT NULL DEFAULT 'AWAITING_ADMIN_VALIDATION';

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "rejectedReason" TEXT,
ADD COLUMN     "status" "ValidationStatus" NOT NULL DEFAULT 'AWAITING_ADMIN_VALIDATION',
ADD COLUMN     "validatedByAdmin" BOOLEAN DEFAULT false,
ADD COLUMN     "validatedBySuperAdmin" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "SalaryAdvance" ADD COLUMN     "creatorId" TEXT,
ADD COLUMN     "rejectedReason" TEXT,
ADD COLUMN     "validatedByAdmin" BOOLEAN DEFAULT false,
ADD COLUMN     "validatedBySuperAdmin" BOOLEAN DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" "ValidationStatus" NOT NULL DEFAULT 'AWAITING_ADMIN_VALIDATION';

-- DropEnum
DROP TYPE "LeaveStatus";

-- DropEnum
DROP TYPE "SalaryAdvanceStatus";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryAdvance" ADD CONSTRAINT "SalaryAdvance_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
