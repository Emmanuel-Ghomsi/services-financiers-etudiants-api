-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "validatedByAdmin" DROP DEFAULT,
ALTER COLUMN "validatedByAdmin" SET DATA TYPE TEXT,
ALTER COLUMN "validatedBySuperAdmin" DROP DEFAULT,
ALTER COLUMN "validatedBySuperAdmin" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Leave" ALTER COLUMN "validatedByAdmin" DROP DEFAULT,
ALTER COLUMN "validatedByAdmin" SET DATA TYPE TEXT,
ALTER COLUMN "validatedBySuperAdmin" DROP DEFAULT,
ALTER COLUMN "validatedBySuperAdmin" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Salary" ALTER COLUMN "validatedByAdmin" DROP DEFAULT,
ALTER COLUMN "validatedByAdmin" SET DATA TYPE TEXT,
ALTER COLUMN "validatedBySuperAdmin" DROP DEFAULT,
ALTER COLUMN "validatedBySuperAdmin" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SalaryAdvance" ALTER COLUMN "validatedByAdmin" DROP DEFAULT,
ALTER COLUMN "validatedByAdmin" SET DATA TYPE TEXT,
ALTER COLUMN "validatedBySuperAdmin" DROP DEFAULT,
ALTER COLUMN "validatedBySuperAdmin" SET DATA TYPE TEXT;
