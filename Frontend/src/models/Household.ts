export type Household = {
  id: string;
  name: string;
  inviteCode: string;
  ownerId: string;
  members: {
    userId: string;
    role: 'owner' | 'member';
    joinedAt: Date;
  }[];
  createdAt: Date;
};
