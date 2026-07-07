import { createRxDatabase } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { todoSchema } from "./schemas/todo.schema";

import type { AppDatabase } from "./types";

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
});

export default db;