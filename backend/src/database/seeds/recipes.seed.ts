import { MealCategory, MealType } from '@prisma/client';

export const recipes = [
  // Breakfast Items
  {
    name: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe filled with spiced potato filling, served with sambar and coconut chutney.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Soak rice and urad dal separately for 4-6 hours\n2. Grind to make smooth batter\n3. Ferment overnight\n4. Make potato masala with onions, potatoes, and spices\n5. Spread dosa batter on hot griddle\n6. Add filling and fold\n7. Serve with sambar and chutney',
    preparationTime: 30,
    cookingTime: 15,
    servings: 2,
    costPerServing: 50,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500',
    ingredients: [
      { name: 'Rice', quantity: '2 cups', unit: 'cup' },
      { name: 'Urad Dal', quantity: '1/2', unit: 'cup' },
      { name: 'Potatoes', quantity: '3', unit: 'medium' },
      { name: 'Onions', quantity: '2', unit: 'medium' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '1', unit: 'sprig' },
      { name: 'Mustard Seeds', quantity: '1', unit: 'tsp' },
      { name: 'Turmeric Powder', quantity: '1/4', unit: 'tsp' },
      { name: 'Salt', quantity: 'to taste', unit: 'tsp' }
    ]
  },
  {
    name: 'Idli Sambar',
    description: 'Steamed rice and lentil cakes served with spiced lentil soup and coconut chutney.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Soak rice and urad dal for 4-6 hours\n2. Grind to make smooth batter\n3. Ferment overnight\n4. Pour into idli molds\n5. Steam for 10-12 minutes\n6. Prepare sambar with vegetables and spices\n7. Serve hot with coconut chutney',
    preparationTime: 20,
    cookingTime: 20,
    servings: 4,
    costPerServing: 40,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Rice', quantity: '2', unit: 'cups' },
      { name: 'Urad Dal', quantity: '1', unit: 'cup' },
      { name: 'Toor Dal', quantity: '1', unit: 'cup' },
      { name: 'Mixed Vegetables', quantity: '2', unit: 'cups' },
      { name: 'Sambar Powder', quantity: '2', unit: 'tbsp' },
      { name: 'Tamarind', quantity: '1', unit: 'small ball' },
      { name: 'Coconut', quantity: '1/2', unit: 'cup' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' }
    ]
  },
  {
    name: 'Pongal',
    description: 'Creamy rice and moong dal porridge seasoned with black pepper and cumin.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Wash rice and moong dal\n2. Cook together with water\n3. Add ghee and spices\n4. Cook until creamy\n5. Season with black pepper and cumin\n6. Serve hot with coconut chutney',
    preparationTime: 15,
    cookingTime: 25,
    servings: 4,
    costPerServing: 35,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Rice', quantity: '1', unit: 'cup' },
      { name: 'Moong Dal', quantity: '1/2', unit: 'cup' },
      { name: 'Ghee', quantity: '2', unit: 'tbsp' },
      { name: 'Black Pepper', quantity: '1', unit: 'tsp' },
      { name: 'Cumin Seeds', quantity: '1', unit: 'tsp' },
      { name: 'Cashews', quantity: '10', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '1', unit: 'sprig' }
    ]
  },
  {
    name: 'Egg Dosa',
    description: 'Crispy dosa topped with beaten egg and spices.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Prepare dosa batter\n2. Heat griddle\n3. Spread dosa batter\n4. Break egg on top\n5. Add spices and onions\n6. Cook until crispy\n7. Serve hot with chutney',
    preparationTime: 20,
    cookingTime: 10,
    servings: 2,
    costPerServing: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Dosa Batter', quantity: '2', unit: 'cups' },
      { name: 'Eggs', quantity: '2', unit: 'pieces' },
      { name: 'Onions', quantity: '1', unit: 'medium' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Coriander Leaves', quantity: '1/4', unit: 'cup' },
      { name: 'Salt', quantity: 'to taste', unit: 'tsp' },
      { name: 'Oil', quantity: '2', unit: 'tbsp' }
    ]
  },
  {
    name: 'Upma',
    description: 'Savory semolina porridge with vegetables and spices.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Roast semolina until golden\n2. Sauté mustard seeds and curry leaves\n3. Add vegetables and cook\n4. Add water and bring to boil\n5. Add semolina and cook\n6. Season with salt and pepper\n7. Garnish with coriander',
    preparationTime: 10,
    cookingTime: 15,
    servings: 3,
    costPerServing: 30,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Semolina', quantity: '1', unit: 'cup' },
      { name: 'Onions', quantity: '1', unit: 'medium' },
      { name: 'Carrots', quantity: '1', unit: 'medium' },
      { name: 'Green Peas', quantity: '1/4', unit: 'cup' },
      { name: 'Mustard Seeds', quantity: '1', unit: 'tsp' },
      { name: 'Curry Leaves', quantity: '1', unit: 'sprig' },
      { name: 'Ghee', quantity: '2', unit: 'tbsp' }
    ]
  },
  // Lunch Items
  {
    name: 'Meals Plate',
    description: 'Traditional South Indian thali with rice, sambar, rasam, curries, and papad.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Cook rice\n2. Prepare sambar with vegetables\n3. Make rasam with tomatoes and spices\n4. Prepare vegetable curries\n5. Fry papad\n6. Arrange on banana leaf\n7. Serve with pickle and buttermilk',
    preparationTime: 45,
    cookingTime: 30,
    servings: 1,
    costPerServing: 120,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Rice', quantity: '1', unit: 'cup' },
      { name: 'Toor Dal', quantity: '1/2', unit: 'cup' },
      { name: 'Mixed Vegetables', quantity: '2', unit: 'cups' },
      { name: 'Tomatoes', quantity: '2', unit: 'medium' },
      { name: 'Sambar Powder', quantity: '2', unit: 'tbsp' },
      { name: 'Rasam Powder', quantity: '1', unit: 'tbsp' },
      { name: 'Papad', quantity: '2', unit: 'pieces' }
    ]
  },
  {
    name: 'Chicken Chettinad',
    description: 'Spicy chicken curry in Chettinad style with coconut and black pepper.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Marinate chicken with spices\n2. Prepare Chettinad masala paste\n3. Sauté onions and tomatoes\n4. Add masala and cook\n5. Add chicken and cook\n6. Finish with curry leaves\n7. Serve hot with rice or roti',
    preparationTime: 30,
    cookingTime: 40,
    servings: 4,
    costPerServing: 150,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Chicken', quantity: '1', unit: 'kg' },
      { name: 'Onions', quantity: '3', unit: 'medium' },
      { name: 'Tomatoes', quantity: '2', unit: 'medium' },
      { name: 'Coconut', quantity: '1', unit: 'cup' },
      { name: 'Black Pepper', quantity: '1', unit: 'tbsp' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' },
      { name: 'Chettinad Masala', quantity: '3', unit: 'tbsp' }
    ]
  },
  {
    name: 'Fish Curry',
    description: 'Fish cooked in tangy tamarind and coconut gravy.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Clean and cut fish\n2. Prepare masala paste\n3. Extract tamarind juice\n4. Cook masala in oil\n5. Add tamarind water\n6. Add fish and cook\n7. Finish with coconut milk',
    preparationTime: 25,
    cookingTime: 30,
    servings: 4,
    costPerServing: 180,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Fish', quantity: '1', unit: 'kg' },
      { name: 'Tamarind', quantity: '1', unit: 'small ball' },
      { name: 'Coconut', quantity: '1', unit: 'cup' },
      { name: 'Onions', quantity: '2', unit: 'medium' },
      { name: 'Green Chilies', quantity: '3', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' },
      { name: 'Fish Curry Powder', quantity: '2', unit: 'tbsp' }
    ]
  },
  {
    name: 'Avial',
    description: 'Mixed vegetables in coconut and yogurt gravy.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Cut vegetables into long pieces\n2. Prepare coconut paste\n3. Cook vegetables with turmeric\n4. Add coconut paste\n5. Add yogurt\n6. Season with curry leaves\n7. Serve hot with rice',
    preparationTime: 30,
    cookingTime: 25,
    servings: 4,
    costPerServing: 80,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Mixed Vegetables', quantity: '4', unit: 'cups' },
      { name: 'Coconut', quantity: '1', unit: 'cup' },
      { name: 'Yogurt', quantity: '1/2', unit: 'cup' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' },
      { name: 'Coconut Oil', quantity: '2', unit: 'tbsp' }
    ]
  },
  {
    name: 'Mutton Pepper Fry',
    description: 'Spicy mutton stir-fry with black pepper and curry leaves.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Marinate mutton with spices\n2. Pressure cook mutton\n3. Prepare masala paste\n4. Sauté onions and masala\n5. Add mutton and cook\n6. Add black pepper\n7. Finish with curry leaves',
    preparationTime: 35,
    cookingTime: 45,
    servings: 4,
    costPerServing: 200,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Mutton', quantity: '1', unit: 'kg' },
      { name: 'Onions', quantity: '3', unit: 'medium' },
      { name: 'Black Pepper', quantity: '2', unit: 'tbsp' },
      { name: 'Ginger Garlic Paste', quantity: '2', unit: 'tbsp' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' },
      { name: 'Coconut Oil', quantity: '3', unit: 'tbsp' }
    ]
  },
  // Dinner Items
  {
    name: 'Kerala Fish Molee',
    description: 'Fish cooked in coconut milk with mild spices.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Clean and cut fish\n2. Prepare coconut milk\n3. Sauté onions and spices\n4. Add coconut milk\n5. Add fish and cook gently\n6. Add vegetables\n7. Finish with curry leaves',
    preparationTime: 25,
    cookingTime: 30,
    servings: 4,
    costPerServing: 160,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Fish', quantity: '1', unit: 'kg' },
      { name: 'Coconut Milk', quantity: '2', unit: 'cups' },
      { name: 'Onions', quantity: '2', unit: 'medium' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Ginger', quantity: '1', unit: 'inch' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' },
      { name: 'Whole Spices', quantity: '1', unit: 'tbsp' }
    ]
  },
  {
    name: 'Vegetable Stew',
    description: 'Mild coconut milk based vegetable stew with whole spices.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Cut vegetables\n2. Prepare coconut milk\n3. Sauté whole spices\n4. Add vegetables\n5. Add coconut milk\n6. Cook until done\n7. Season with curry leaves',
    preparationTime: 20,
    cookingTime: 25,
    servings: 4,
    costPerServing: 70,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Mixed Vegetables', quantity: '3', unit: 'cups' },
      { name: 'Coconut Milk', quantity: '2', unit: 'cups' },
      { name: 'Whole Spices', quantity: '1', unit: 'tbsp' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Ginger', quantity: '1', unit: 'inch' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' }
    ]
  },
  {
    name: 'Chicken Stew',
    description: 'Kerala style chicken stew in coconut milk.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Cut chicken\n2. Prepare coconut milk\n3. Sauté whole spices\n4. Add chicken and cook\n5. Add vegetables\n6. Add coconut milk\n7. Finish with curry leaves',
    preparationTime: 25,
    cookingTime: 35,
    servings: 4,
    costPerServing: 140,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Chicken', quantity: '1', unit: 'kg' },
      { name: 'Coconut Milk', quantity: '2', unit: 'cups' },
      { name: 'Potatoes', quantity: '2', unit: 'medium' },
      { name: 'Carrots', quantity: '2', unit: 'medium' },
      { name: 'Whole Spices', quantity: '1', unit: 'tbsp' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' }
    ]
  },
  {
    name: 'Puttu',
    description: 'Steamed rice flour cylinders with coconut.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Mix rice flour with salt\n2. Layer with coconut\n3. Steam in puttu maker\n4. Serve hot with kadala curry',
    preparationTime: 15,
    cookingTime: 20,
    servings: 4,
    costPerServing: 50,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Rice Flour', quantity: '2', unit: 'cups' },
      { name: 'Coconut', quantity: '1', unit: 'cup' },
      { name: 'Salt', quantity: 'to taste', unit: 'tsp' },
      { name: 'Water', quantity: 'as needed', unit: 'cup' }
    ]
  },
  {
    name: 'Appam',
    description: 'Lacy rice and coconut pancakes.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Prepare batter with rice and coconut\n2. Ferment overnight\n3. Heat appam pan\n4. Pour batter\n5. Swirl to make lacy edges\n6. Cook until done\n7. Serve with stew',
    preparationTime: 20,
    cookingTime: 15,
    servings: 4,
    costPerServing: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Rice', quantity: '2', unit: 'cups' },
      { name: 'Coconut', quantity: '1', unit: 'cup' },
      { name: 'Yeast', quantity: '1/4', unit: 'tsp' },
      { name: 'Sugar', quantity: '1', unit: 'tsp' },
      { name: 'Salt', quantity: 'to taste', unit: 'tsp' }
    ]
  },
  // Additional Items
  {
    name: 'Vada Sambar',
    description: 'Crispy lentil fritters served with sambar.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Soak urad dal\n2. Grind to make batter\n3. Add spices and onions\n4. Shape and fry\n5. Prepare sambar\n6. Serve hot with chutney',
    preparationTime: 25,
    cookingTime: 20,
    servings: 4,
    costPerServing: 45,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Urad Dal', quantity: '1', unit: 'cup' },
      { name: 'Onions', quantity: '1', unit: 'medium' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '1', unit: 'sprig' },
      { name: 'Sambar Powder', quantity: '2', unit: 'tbsp' },
      { name: 'Oil', quantity: 'for frying', unit: 'cup' }
    ]
  },
  {
    name: 'Kerala Parotta',
    description: 'Layered flatbread made with maida.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Prepare dough with maida\n2. Rest for 2 hours\n3. Make small balls\n4. Roll and layer\n5. Cook on griddle\n6. Serve with curry',
    preparationTime: 30,
    cookingTime: 20,
    servings: 4,
    costPerServing: 40,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Maida', quantity: '2', unit: 'cups' },
      { name: 'Egg', quantity: '1', unit: 'piece' },
      { name: 'Oil', quantity: '2', unit: 'tbsp' },
      { name: 'Salt', quantity: 'to taste', unit: 'tsp' },
      { name: 'Sugar', quantity: '1', unit: 'tsp' }
    ]
  },
  {
    name: 'Prawn Curry',
    description: 'Prawns cooked in spicy coconut gravy.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Clean prawns\n2. Prepare masala paste\n3. Sauté onions and masala\n4. Add prawns\n5. Add coconut milk\n6. Cook until done\n7. Finish with curry leaves',
    preparationTime: 25,
    cookingTime: 25,
    servings: 4,
    costPerServing: 220,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Prawns', quantity: '500', unit: 'g' },
      { name: 'Coconut', quantity: '1', unit: 'cup' },
      { name: 'Onions', quantity: '2', unit: 'medium' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '2', unit: 'sprigs' },
      { name: 'Prawn Curry Powder', quantity: '2', unit: 'tbsp' }
    ]
  },
  {
    name: 'Kootu Curry',
    description: 'Mixed vegetables and lentils in coconut gravy.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Cook vegetables\n2. Prepare coconut paste\n3. Cook dal separately\n4. Combine vegetables and dal\n5. Add coconut paste\n6. Season with spices\n7. Serve hot with rice',
    preparationTime: 25,
    cookingTime: 30,
    servings: 4,
    costPerServing: 65,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Mixed Vegetables', quantity: '3', unit: 'cups' },
      { name: 'Toor Dal', quantity: '1/2', unit: 'cup' },
      { name: 'Coconut', quantity: '1', unit: 'cup' },
      { name: 'Green Chilies', quantity: '2', unit: 'pieces' },
      { name: 'Curry Leaves', quantity: '1', unit: 'sprig' },
      { name: 'Turmeric Powder', quantity: '1/4', unit: 'tsp' }
    ]
  },
  {
    name: 'Kerala Biryani',
    description: 'Fragrant rice dish with chicken and spices.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Marinate chicken\n2. Prepare biryani masala\n3. Cook rice partially\n4. Layer rice and chicken\n5. Add saffron milk\n6. Dum cook\n7. Serve with raita',
    preparationTime: 40,
    cookingTime: 30,
    servings: 4,
    costPerServing: 180,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
    ingredients: [
      { name: 'Chicken', quantity: '1', unit: 'kg' },
      { name: 'Basmati Rice', quantity: '2', unit: 'cups' },
      { name: 'Biryani Masala', quantity: '3', unit: 'tbsp' },
      { name: 'Onions', quantity: '3', unit: 'medium' },
      { name: 'Mint Leaves', quantity: '1/2', unit: 'cup' },
      { name: 'Saffron', quantity: '1', unit: 'pinch' },
      { name: 'Ghee', quantity: '3', unit: 'tbsp' }
    ]
  }
]; 