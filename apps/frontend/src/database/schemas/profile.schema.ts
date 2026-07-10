import {
    toTypedRxJsonSchema,
    type ExtractDocumentTypeFromTypedRxJsonSchema,
    type RxCollection,
} from "rxdb";

export const profileSchemaLiteral = {
    title: "profile schema",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 100,
        },

        username: {
            type: "string",
        },

        email: {
            type: "string",
        },

        isGuest: {
            type: "boolean",
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
        "username",
        "email",
        "isGuest",
        "createdAt",
        "updatedAt",
    ],
} as const;

const schemaTyped = toTypedRxJsonSchema(profileSchemaLiteral);

export const profileSchema = schemaTyped;

export type ProfileDocType =
    ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export type ProfileCollection =
    RxCollection<ProfileDocType>;