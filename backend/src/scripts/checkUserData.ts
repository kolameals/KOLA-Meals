import prisma from '../lib/prisma.js';

async function checkUserData() {
  try {
    // Get a specific user with relations
    const user = await prisma.user.findUnique({
      where: {
        email: 'shrayank@kolameals.com'
      },
      include: {
        addresses: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });

    console.log('User data:', JSON.stringify(user, null, 2));

    // Check if there are any addresses
    const addresses = await prisma.address.findMany({
      take: 5
    });
    console.log('\nSample addresses:', JSON.stringify(addresses, null, 2));

    // Check if there are any subscriptions
    const subscriptions = await prisma.subscription.findMany({
      take: 5,
      include: {
        plan: true
      }
    });
    console.log('\nSample subscriptions:', JSON.stringify(subscriptions, null, 2));

  } catch (error) {
    console.error('Error checking user data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserData(); 