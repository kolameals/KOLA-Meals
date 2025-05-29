import prisma from '../lib/prisma';

async function checkData() {
  try {
    // Check users with their relations
    const users = await prisma.user.findMany({
      include: {
        addresses: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });

    console.log('Total users:', users.length);
    console.log('\nFirst user details:');
    console.log(JSON.stringify(users[0], null, 2));

    // Check addresses
    const addresses = await prisma.address.findMany();
    console.log('\nTotal addresses:', addresses.length);
    console.log('\nFirst address details:');
    console.log(JSON.stringify(addresses[0], null, 2));

    // Check subscriptions
    const subscriptions = await prisma.subscription.findMany({
      include: {
        plan: true
      }
    });
    console.log('\nTotal subscriptions:', subscriptions.length);
    console.log('\nFirst subscription details:');
    console.log(JSON.stringify(subscriptions[0], null, 2));

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 