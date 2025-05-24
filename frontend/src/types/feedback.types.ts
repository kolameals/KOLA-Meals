export interface Feedback {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  rating?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  issues: Issue[];
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
} 