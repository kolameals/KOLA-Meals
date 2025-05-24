// Kitchen Analytics Types
export interface KitchenEfficiencyMetrics {
  totalOrders: number;
  averagePreparationTime: number;
  onTimeDeliveryRate: number;
  kitchenUtilizationRate: number;
  peakHours: {
    hour: number;
    orderCount: number;
  }[];
}

export interface KitchenCostAnalysis {
  totalCost: number;
  costBreakdown: {
    ingredients: number;
    labor: number;
    utilities: number;
    packaging: number;
    other: number;
  };
  costPerOrder: number;
  costTrends: {
    date: string;
    totalCost: number;
  }[];
}

export interface ResourceUtilization {
  staffUtilization: {
    totalStaffHours: number;
    productiveHours: number;
    utilizationRate: number;
  };
  equipmentUtilization: {
    equipmentName: string;
    utilizationRate: number;
    downtime: number;
  }[];
  inventoryUtilization: {
    totalItems: number;
    activeItems: number;
    utilizationRate: number;
  };
} 