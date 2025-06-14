import prisma from '../lib/prisma.js';

async function checkUserRelations() {
  try {
    // Get all users with their relations
    const users = await prisma.user.findMany({
      take: 5,
      include: {
        addresses: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });

    console.log('Total users:', await prisma.user.count());
    console.log('Total addresses:', await prisma.address.count());
    console.log('Total subscriptions:', await prisma.subscription.count());

    // Log each user's data
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Addresses:', user.addresses.length);
      console.log('Has subscription:', !!user.subscription);
      if (user.subscription) {
        console.log('Subscription plan:', user.subscription.plan.name);
      }
    });

  } catch (error) {
    console.error('Error checking user relations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRelations(); 