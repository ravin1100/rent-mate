export type Member = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  joinedAt: Date;
  role: 'owner' | 'member';
};
