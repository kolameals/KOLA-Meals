export type CostType = 'FIXED' | 'VARIABLE' | 'RAW_MATERIAL' | 'STAFF' | 'EQUIPMENT' | 'FACILITY';
export type CostFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';
export type CostStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CostCategory {
  id: number;
  name: string;
  description: string;
  type: CostType;
  frequency: CostFrequency;
  created_at: Date;
  updated_at: Date;
}

export interface Cost {
  id: number;
  category_id: number;
  amount: number;
  description: string;
  date: Date;
  status: string;
  approved_by?: number;
  approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface StaffCost {
  id: number;
  user_id: number;
  base_salary: number;
  allowances: number;
  deductions: number;
  payment_frequency: CostFrequency;
  bank_details: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface EquipmentCost {
  id: number;
  name: string;
  description: string;
  purchase_date: Date;
  purchase_amount: number;
  emi_amount: number;
  emi_frequency: CostFrequency;
  total_emis: number;
  remaining_emis: number;
  created_at: Date;
  updated_at: Date;
}

export interface FacilityCost {
  id: number;
  name: string;
  description: string;
  rent_amount: number;
  maintenance_amount: number;
  utilities_amount: number;
  frequency: CostFrequency;
  created_at: Date;
  updated_at: Date;
}

export interface CostApproval {
  id: number;
  cost_id: number;
  approver_id: number;
  status: string;
  comments: string;
  created_at: Date;
  updated_at: Date;
} 