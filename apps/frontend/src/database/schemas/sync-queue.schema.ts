import type { RxJsonSchema } from "rxdb";

export interface SyncQueueDocType {

    documentId: string;

    collectionName: "todos";

    operation: "create" | "update" | "delete";

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

        collectionName: {
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
        "collectionName",
        "operation",
        "timestamp",
    ],
};