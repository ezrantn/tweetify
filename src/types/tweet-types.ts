export interface Tweet {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  image: string | null;
  impression: number;
}