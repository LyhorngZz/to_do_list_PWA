import type { RxCollection, RxDatabase } from "rxdb";
import type { TodoDocType } from "./schemas/todo.schema";
import type { SyncQueueDocType } from "./schemas/sync-queue.schema";
import type { SyncMetaDocType } from "./schemas/sync-meta.schema";
import type { ProfileDocType } from "./schemas/profile.schema";

export type TodoCollection = RxCollection<TodoDocType>;
export type SyncQueueCollection = RxCollection<SyncQueueDocType>;
export type SyncMetaCollection = RxCollection<SyncMetaDocType>;
export type ProfileCollection = RxCollection<ProfileDocType>;

export type AppDatabaseCollections = {
    todos: TodoCollection;
    syncQueue: SyncQueueCollection;
    syncMeta: SyncMetaCollection;
    profile: ProfileCollection;
};

export type AppDatabase = RxDatabase<AppDatabaseCollections>;