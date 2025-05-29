CREATE TABLE "DeliveryCostConfig" (
    "id" SERIAL PRIMARY KEY,
    "costPerAgent" DECIMAL(10,2) NOT NULL DEFAULT 8000.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default value
INSERT INTO "DeliveryCostConfig" ("costPerAgent") VALUES (8000.00); 