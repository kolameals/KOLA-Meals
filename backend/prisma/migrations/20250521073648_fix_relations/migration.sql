/*
  Warnings:

  - You are about to drop the column `deliveredAt` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Delivery` table. All the data in the column will be lost.
  - The `status` column on the `Delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `mealsPerDay` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `Subscription` table. All the data in the column will be lost.
  - The `status` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `address` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "deliveredAt",
DROP COLUMN "scheduledDate",
ADD COLUMN     "address" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalAmount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL,
ADD COLUMN     "paymentDetails" JSONB,
ADD COLUMN     "paymentLink" TEXT,
ADD COLUMN     "paymentSessionId" TEXT,
ADD COLUMN     "paymentStatus" TEXT DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "mealsPerDay",
DROP COLUMN "plan",
DROP COLUMN "preferences",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
