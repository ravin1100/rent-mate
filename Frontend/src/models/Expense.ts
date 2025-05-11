export type Expense = {
  id: string;
  householdId: string;
  amount: number;
  description: string;
  date: Date;
  paidBy: string; // userId
  participants: {
    userId: string;
    share: number; // percentage or fixed amount
  }[];
  createdAt: Date;
};
