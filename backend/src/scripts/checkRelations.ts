import prisma from '../lib/prisma.js';

async function checkRelations() {
  try {
    // Check users with their relations
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

    console.log('Total users:', await prisma.user.count());
    console.log('Total addresses:', await prisma.address.count());
    console.log('Total subscriptions:', await prisma.subscription.count());

    if (users.length > 0) {
      const user = users[0];
      console.log('\nFirst user details:');
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      console.log('User name:', user.name);
      
      console.log('\nAddresses:');
      console.log(JSON.stringify(user.addresses, null, 2));
      
      console.log('\nSubscription:');
      console.log(JSON.stringify(user.subscription, null, 2));
    } else {
      console.log('No users found in the database');
    }
  } catch (error) {
    console.error('Error checking relations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRelations(); 