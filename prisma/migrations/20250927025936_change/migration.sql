/*
  Warnings:

  - The values [INCOME_FROM_VOUCHER_P_CANCELLATION] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('INCOME_SALE', 'INCOME_TRANSFER_BRANCH', 'INCOME_FROM_VOUCHER_CANCELLATION', 'EXPENSE_FROM_VOUCHER_P_CANCELLATION', 'EXPENSE_BY_CATEGORY', 'EXPENSE_EMPLOYEED', 'EXPENSE_SUPPLIER', 'EXPENSE_TRANSFER_BRANCH');
ALTER TABLE "EBoxTransaction" ALTER COLUMN "transactionType" TYPE "TransactionType_new" USING ("transactionType"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;
