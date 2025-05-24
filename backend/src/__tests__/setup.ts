import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Create a new Prisma client for testing
const prisma = new PrismaClient();

// Global setup
beforeAll(async () => {
  // Clean up database before tests
  await prisma.$connect();
  await cleanDatabase();
});

// Global teardown
afterAll(async () => {
  await prisma.$disconnect();
});

// Clean database function
async function cleanDatabase() {
  const tables = [
    'User',
    'Meal',
    'Subscription',
    'Order',
    'Delivery',
    // Add other tables as needed
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
}

// Export test utilities
export const testUtils = {
  prisma,
  cleanDatabase,
}; 