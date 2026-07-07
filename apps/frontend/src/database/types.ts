import type { RxCollection, RxDatabase } from "rxdb";
import type { TodoDocType } from "./schemas/todo.schema";

export type TodoCollection = RxCollection<TodoDocType>;

export type AppDatabaseCollections = {
    todos: TodoCollection;
};

export type AppDatabase = RxDatabase<AppDatabaseCollections>;