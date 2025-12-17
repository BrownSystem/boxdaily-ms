-- CreateEnum
CREATE TYPE "EBoxStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME_SALE', 'INCOME_TRANSFER_BRANCH', 'EXPENSE_BY_CATEGORY', 'EXPENSE_EMPLOYEED', 'EXPENSE_SUPPLIER', 'EXPENSE_TRANSFER_BRANCH');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('EFECTIVO', 'CHEQUE', 'CHEQUE_TERCERO', 'TRANSFERENCIA', 'TARJETA');

-- CreateTable
CREATE TABLE "EBoxDaily" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "openedBy" TEXT NOT NULL,
    "closedBy" TEXT,
    "openingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingAmount" DOUBLE PRECISION DEFAULT 0,
    "realAmount" DOUBLE PRECISION DEFAULT 0,
    "status" "EBoxStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalSales" DOUBLE PRECISION DEFAULT 0,
    "totalExpenses" DOUBLE PRECISION DEFAULT 0,
    "income" DOUBLE PRECISION DEFAULT 0,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EBoxDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EBoxCategory" (
    "id" TEXT NOT NULL,
    "code" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EBoxCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EBoxTransaction" (
    "id" TEXT NOT NULL,
    "boxId" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "paymentMethod" "PaymentMethod",
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT,
    "description" TEXT,
    "voucherId" TEXT,
    "voucherNumber" TEXT,
    "categoryId" TEXT,
    "categoryName" TEXT,
    "employeedId" TEXT,
    "employeedName" TEXT,
    "clientId" TEXT,
    "clientName" TEXT,
    "supplierId" TEXT,
    "supplierName" TEXT,
    "branchName" TEXT,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EBoxTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EBoxDaily_branchId_openedAt_idx" ON "EBoxDaily"("branchId", "openedAt");

-- CreateIndex
CREATE INDEX "EBoxDaily_status_idx" ON "EBoxDaily"("status");

-- CreateIndex
CREATE INDEX "EBoxTransaction_boxId_createdAt_idx" ON "EBoxTransaction"("boxId", "createdAt");

-- CreateIndex
CREATE INDEX "EBoxTransaction_transactionType_paymentMethod_idx" ON "EBoxTransaction"("transactionType", "paymentMethod");

-- AddForeignKey
ALTER TABLE "EBoxTransaction" ADD CONSTRAINT "EBoxTransaction_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "EBoxDaily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EBoxTransaction" ADD CONSTRAINT "EBoxTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EBoxCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
