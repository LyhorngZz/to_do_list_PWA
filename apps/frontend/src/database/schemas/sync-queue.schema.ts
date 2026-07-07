import type { RxJsonSchema } from "rxdb";

export interface SyncQueueDocType {

    // Todo id
    documentId: string;

    // Collection name (future-proof)
    collection: "todos";

    // What happened
    operation: "create" | "update" | "delete";

    // When this operation happened
    timestamp: string;
}

export const syncQueueSchema: RxJsonSchema<SyncQueueDocType> = {
    title: "Sync Queue Schema",
    version: 0,
    primaryKey: "documentId",
    type: "object",

    properties: {

        documentId: {
            type: "string",
            maxLength: 100,
        },

        collection: {
            type: "string",
            enum: ["todos"],
        },

        operation: {
            type: "string",
            enum: [
                "create",
                "update",
                "delete",
            ],
        },

        timestamp: {
            type: "string",
            format: "date-time",
        },
    },

    required: [
        "documentId",
        "collection",
        "operation",
        "timestamp",
    ],
};