/*
  Warnings:

  - Added the required column `apartment` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomNumber` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tower` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatusEnum" AS ENUM ('PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'MISSED', 'DELAYED');

-- CreateEnum
CREATE TYPE "OldTiffinStatusEnum" AS ENUM ('COLLECTED', 'NOT_COLLECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "TiffinBoxStatusEnum" AS ENUM ('AVAILABLE', 'IN_USE', 'DAMAGED', 'RETIRED');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "apartment" TEXT NOT NULL,
ADD COLUMN     "floor" TEXT NOT NULL,
ADD COLUMN     "roomNumber" TEXT NOT NULL,
ADD COLUMN     "tower" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DeliveryStatus";

-- CreateTable
CREATE TABLE "DailyMeal" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "breakfastId" TEXT NOT NULL,
    "lunchId" TEXT NOT NULL,
    "dinnerId" TEXT NOT NULL,
    "skipStatus" JSONB NOT NULL,
    "cutoffTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryStatus" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "DeliveryStatusEnum" NOT NULL,
    "oldTiffinStatus" "OldTiffinStatusEnum" NOT NULL,
    "deliveryTime" TIMESTAMP(3) NOT NULL,
    "deliveryPartnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealFeedback" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "categories" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "minimumStock" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiffinBox" (
    "id" TEXT NOT NULL,
    "status" "TiffinBoxStatusEnum" NOT NULL,
    "lastUsed" TIMESTAMP(3) NOT NULL,
    "damageReport" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TiffinBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryStatus_orderId_key" ON "DeliveryStatus"("orderId");

-- AddForeignKey
ALTER TABLE "DailyMeal" ADD CONSTRAINT "DailyMeal_breakfastId_fkey" FOREIGN KEY ("breakfastId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMeal" ADD CONSTRAINT "DailyMeal_lunchId_fkey" FOREIGN KEY ("lunchId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMeal" ADD CONSTRAINT "DailyMeal_dinnerId_fkey" FOREIGN KEY ("dinnerId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryStatus" ADD CONSTRAINT "DeliveryStatus_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryStatus" ADD CONSTRAINT "DeliveryStatus_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealFeedback" ADD CONSTRAINT "MealFeedback_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealFeedback" ADD CONSTRAINT "MealFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
