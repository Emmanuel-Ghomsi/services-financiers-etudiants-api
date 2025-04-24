-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'AWAITING_ADMIN_VALIDATION', 'AWAITING_SUPERADMIN_VALIDATION', 'REJECTED', 'BEING_MODIFIED', 'VALIDATED');

-- CreateTable
CREATE TABLE "ClientFile" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "clientCode" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "nonResident" BOOLEAN NOT NULL,
    "lastName" TEXT,
    "firstName" TEXT,
    "email" TEXT,
    "maidenName" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthCity" TEXT,
    "birthCountry" TEXT,
    "identityType" TEXT,
    "identityNumber" TEXT,
    "nationality" TEXT,
    "legalRepresentative" TEXT,
    "hasBankAccount" BOOLEAN,
    "taxIdNumber" TEXT,
    "taxCountry" TEXT,
    "homeAddress" TEXT,
    "postalAddress" TEXT,
    "taxResidenceCountry" TEXT,
    "phoneNumbers" TEXT,
    "profession" TEXT,
    "businessSector" TEXT,
    "activityStartDate" TIMESTAMP(3),
    "activityArea" TEXT,
    "incomeSources" TEXT,
    "monthlyIncome" DOUBLE PRECISION,
    "incomeCurrency" TEXT,
    "fundsOriginDestination" TEXT,
    "assets" TEXT,
    "hasInternationalOps" BOOLEAN,
    "transactionCountries" TEXT,
    "transactionCurrencies" TEXT,
    "offeredAccounts" TEXT,
    "expectedOperations" TEXT,
    "creditAmount" TEXT,
    "debitAmount" TEXT,
    "isPEP" BOOLEAN,
    "pepType" TEXT,
    "pepMandate" TEXT,
    "pepEndDate" TIMESTAMP(3),
    "pepLinkType" TEXT,
    "pepLastName" TEXT,
    "pepFirstName" TEXT,
    "pepBirthDate" TIMESTAMP(3),
    "pepBirthPlace" TEXT,
    "riskLevel" TEXT,
    "classificationSource" TEXT,
    "degradationReason" TEXT,
    "fatcaStatus" TEXT,
    "hasUsIndications" BOOLEAN,
    "usIndicationsDetails" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'DRAFT',
    "creatorId" TEXT NOT NULL,
    "validatorAdminId" TEXT,
    "validatorSuperAdminId" TEXT,
    "validationDateAdmin" TIMESTAMP(3),
    "validationDateSuper" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "fundSources" TEXT[],
    "fundProviderName" TEXT,
    "fundProviderRelation" TEXT,
    "fundDonationExplanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClientFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientFile_reference_key" ON "ClientFile"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "ClientFile_clientCode_key" ON "ClientFile"("clientCode");

-- AddForeignKey
ALTER TABLE "ClientFile" ADD CONSTRAINT "ClientFile_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
