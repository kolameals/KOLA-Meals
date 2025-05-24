export type ProductionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ProductionItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ProductionItem {
  id: string;
  rawMaterialId: string;
  requiredQuantity: number;
  actualQuantity?: number;
  status: ProductionItemStatus;
  rawMaterial: {
    id: string;
    name: string;
    unit: string;
  };
}

export interface ProductionSchedule {
  id: string;
  date: string;
  mealType: string;
  status: ProductionStatus;
  startTime: string;
  endTime: string;
  items: ProductionItem[];
  meal: {
    id: string;
    name: string;
  };
} 