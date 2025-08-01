/*
  Warnings:

  - Added the required column `month` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Salary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RoleEnum" ADD VALUE 'RH';

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
