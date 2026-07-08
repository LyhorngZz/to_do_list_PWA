export interface SyncTodo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
