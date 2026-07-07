import type { RxJsonSchema } from "rxdb";

export interface TodoDocType {
    id: string;
    title: string;
    description: string;
    completed: boolean;

    createdAt: string;
    updatedAt: string;

    syncStatus: "pending" | "synced";
    deleted: boolean;
}

export const todoSchema: RxJsonSchema<TodoDocType> = {
    title: "Todo Schema",
    version: 0,
    primaryKey: "id",
    type: "object",

    properties: {
        id: {
            type: "string",
            maxLength: 100,
        },

        title: {
            type: "string",
            maxLength: 200,
        },

        description: {
            type: "string",
        },

        completed: {
            type: "boolean",
            default: false,
        },

        createdAt: {
            type: "string",
            format: "date-time",
        },

        updatedAt: {
            type: "string",
            format: "date-time",
        },

        syncStatus: {
            type: "string",
            enum: ["pending", "synced"],
            default: "pending",
        },

        deleted: {
            type: "boolean",
            default: false,
        },
    },

    required: [
        "id",
        "title",
        "description",
        "completed",
        "createdAt",
        "updatedAt",
        "syncStatus",
        "deleted",
    ],
};