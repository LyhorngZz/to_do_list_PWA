import type { RxCollection, RxDatabase } from "rxdb";
import type { TodoDocType } from "./schemas/todo.schema";
import type { SyncQueueDocType } from "./schemas/sync-queue.schema";

export type TodoCollection = RxCollection<TodoDocType>;
export type SyncQueueCollection = RxCollection<SyncQueueDocType>;

export type AppDatabaseCollections = {
    todos: TodoCollection;
    syncQueue: SyncQueueCollection;
};

export type AppDatabase = RxDatabase<AppDatabaseCollections>;