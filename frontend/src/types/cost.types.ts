export enum CostStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum CostType {
  STAFF = 'STAFF',
  EQUIPMENT = 'EQUIPMENT',
  FACILITY = 'FACILITY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface StaffCost {
  id: number;
  userId: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  paymentFrequency: 'MONTHLY' | 'WEEKLY' | 'DAILY';
  bankDetails: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface EquipmentCost {
  id: number;
  name: string;
  description: string;
  purchaseDate: Date;
  paymentType: 'one-time' | 'emi' | 'rented';
  // One-time purchase fields
  purchaseAmount?: number;
  // EMI fields
  emiAmount?: number;
  emiFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';
  totalEmis?: number;
  remainingEmis?: number;
  // Rent fields
  monthlyRent?: number;
  securityDeposit?: number;
  rentDuration?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  createdAt: Date;
  updatedAt: Date;
}

export interface FacilityCost {
  id: number;
  name: string;
  description: string;
  type: 'kitchen' | 'office' | 'warehouse';
  rentAmount: number;
  maintenanceAmount: number;
  utilitiesAmount: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostSummary {
  staffCosts: {
    total: number;
    count: number;
  };
  equipmentCosts: {
    total: number;
    count: number;
  };
  facilityCosts: {
    total: number;
    count: number;
  };
  monthlyTrends: {
    month: string;
    total: number;
    staff: number;
    equipment: number;
    facility: number;
  }[];
}

export interface CostCategory {
  id: number;
  name: string;
  type: CostType;
  description?: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME';
}

export interface Cost {
  id: number;
  categoryId: number;
  amount: number;
  description?: string;
  date: Date;
  status: CostStatus;
  approvedById?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  category: CostCategory;
  approvedBy?: User;
  approvals: CostApproval[];
}

export interface CostApproval {
  id: number;
  costId: number;
  approverId: string;
  status: CostStatus;
  comments?: string;
  createdAt: Date;
  approver: User;
}

export interface DeliveryCostConfig {
  id: number;
  costPerAgent: number;
  createdAt: Date;
  updatedAt: Date;
} 