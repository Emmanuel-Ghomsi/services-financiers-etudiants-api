/*
  Warnings:

  - You are about to alter the column `month` on the `Salary` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Char(2)`.
  - You are about to alter the column `year` on the `Salary` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Char(4)`.

*/
-- AlterTable
ALTER TABLE "Salary" ALTER COLUMN "month" SET DATA TYPE CHAR(2),
ALTER COLUMN "year" SET DATA TYPE CHAR(4);
