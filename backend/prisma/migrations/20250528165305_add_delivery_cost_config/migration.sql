-- CreateTable
CREATE TABLE "DeliveryCostConfig" (
    "id" SERIAL NOT NULL,
    "costPerAgent" DECIMAL(65,30) NOT NULL DEFAULT 8000.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryCostConfig_pkey" PRIMARY KEY ("id")
);
