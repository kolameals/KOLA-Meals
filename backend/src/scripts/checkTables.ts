import prisma from '../lib/prisma';

async function checkTables() {
  try {
    // Check table names
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Available tables:', tables);

    // Check User table
    const users = await prisma.user.findMany({
      take: 1,
      include: {
        addresses: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });
    console.log('\nFirst user with relations:', JSON.stringify(users[0], null, 2));

    // Check Address table
    const addresses = await prisma.address.findMany({
      take: 1
    });
    console.log('\nFirst address:', JSON.stringify(addresses[0], null, 2));

    // Check Subscription table
    const subscriptions = await prisma.subscription.findMany({
      take: 1,
      include: {
        plan: true
      }
    });
    console.log('\nFirst subscription:', JSON.stringify(subscriptions[0], null, 2));

  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables(); 