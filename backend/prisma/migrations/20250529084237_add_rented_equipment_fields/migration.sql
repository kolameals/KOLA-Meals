-- AlterTable
ALTER TABLE "EquipmentCost" ADD COLUMN     "monthlyRent" DECIMAL(65,30),
ADD COLUMN     "paymentType" TEXT NOT NULL DEFAULT 'one-time',
ADD COLUMN     "rentDuration" "CostFrequency",
ADD COLUMN     "securityDeposit" DECIMAL(65,30);
