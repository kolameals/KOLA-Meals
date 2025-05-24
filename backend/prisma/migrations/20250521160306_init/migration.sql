/*
  Warnings:

  - You are about to drop the column `price` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Delivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeliveryStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TiffinBox` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "DailyMeal" DROP CONSTRAINT "DailyMeal_breakfastId_fkey";

-- DropForeignKey
ALTER TABLE "DailyMeal" DROP CONSTRAINT "DailyMeal_dinnerId_fkey";

-- DropForeignKey
ALTER TABLE "DailyMeal" DROP CONSTRAINT "DailyMeal_lunchId_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_userId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryStatus" DROP CONSTRAINT "DeliveryStatus_deliveryPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryStatus" DROP CONSTRAINT "DeliveryStatus_orderId_fkey";

-- DropForeignKey
ALTER TABLE "MealFeedback" DROP CONSTRAINT "MealFeedback_mealId_fkey";

-- DropForeignKey
ALTER TABLE "MealFeedback" DROP CONSTRAINT "MealFeedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_mealId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp",
DROP COLUMN "phoneNumber",
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "DailyMeal";

-- DropTable
DROP TABLE "Delivery";

-- DropTable
DROP TABLE "DeliveryStatus";

-- DropTable
DROP TABLE "InventoryItem";

-- DropTable
DROP TABLE "MealFeedback";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "TiffinBox";

-- DropEnum
DROP TYPE "DeliveryStatusEnum";

-- DropEnum
DROP TYPE "OldTiffinStatusEnum";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SubscriptionPlan";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "TiffinBoxStatusEnum";
