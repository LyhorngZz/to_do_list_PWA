import type { RxJsonSchema } from "rxdb";

export interface TodoDocType {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    deleted: boolean;

    createdAt: string;
    updatedAt: string;
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

        deleted: {
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
    },

    required: [
        "id",
        "title",
        "description",
        "completed",
        "deleted",
        "createdAt",
        "updatedAt",
    ],
};