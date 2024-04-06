export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  image: string | null;
  isVerified: boolean;
}