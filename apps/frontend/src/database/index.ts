import { createRxDatabase } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { todoSchema } from "./schemas/todo.schema";

import type { AppDatabase } from "./types";
import { syncQueueSchema } from "./schemas/sync-queue.schema";
import { syncMetaSchema } from "./schemas/sync-meta.schema";
import { profileSchema } from "./schemas/profile.schema"

export const db: AppDatabase = await createRxDatabase({
    name: "todo-pwa",
    storage: getRxStorageDexie(),
    multiInstance: true,
    eventReduce: true,
});

await db.addCollections({
    todos: {
        schema: todoSchema,
    },
    syncQueue: {
        schema: syncQueueSchema,
    },
    syncMeta: {
        schema: syncMetaSchema,
    },
    profile: {
        schema: profileSchema,
    },
});

export default db;