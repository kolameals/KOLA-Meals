export interface GeneratedRecipe {
  name: string;
  description: string;
  category: string;
  type: string;
  servings: number;
  preparationTime: number;
  cookingTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
    cost?: {
      perUnit: number;
      unit: string;
      total: number;
      perServing: number;
      bulkDiscount?: number;
    };
    image?: string;
    icon?: string;
  }[];
  instructions: {
    step: number;
    description: string;
    image?: string;
    icon?: string;
  }[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  costEstimate: {
    totalCost: number;
    costPerServing: number;
    bulkDiscount: number;
    costBreakdown: {
      category: string;
      cost: number;
      percentage: number;
    }[];
  };
  tips: {
    title: string;
    description: string;
    icon?: string;
  }[];
  variations: {
    name: string;
    description: string;
    image?: string;
  }[];
  pairings: {
    name: string;
    description: string;
    image?: string;
  }[];
  images: {
    main: string;
    ingredients: string[];
    steps: string[];
    presentation: string;
  };
  icons: {
    preparation: string;
    cooking: string;
    difficulty: string;
    servings: string;
    cost: string;
  };
} 