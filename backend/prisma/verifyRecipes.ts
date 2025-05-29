import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipes = await prisma.recipe.findMany({
    select: {
      name: true,
      category: true,
      type: true,
    },
    orderBy: { name: 'asc' }
  });
  console.log('Recipes in DB:');
  for (const recipe of recipes) {
    console.log(`- ${recipe.name} [${recipe.category}, ${recipe.type}]`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 