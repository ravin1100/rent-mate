export type Chore = {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  assignedTo: string; // userId
  completedBy?: string; // userId
  completedAt?: Date;
  dueDate: Date;
  createdBy: string; // userId
  createdAt: Date;
};
