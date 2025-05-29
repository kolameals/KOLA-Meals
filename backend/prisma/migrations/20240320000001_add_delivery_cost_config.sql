-- CreateTable
CREATE TABLE "DeliveryCostConfig" (
    "id" SERIAL NOT NULL,
    "costPerAgent" DECIMAL(10,2) NOT NULL DEFAULT 8000.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryCostConfig_pkey" PRIMARY KEY ("id")
);

-- Insert default delivery cost configuration
INSERT INTO "DeliveryCostConfig" ("costPerAgent", "createdAt", "updatedAt")
VALUES (8000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 