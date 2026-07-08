export interface SyncMetaDocType {
    id: "sync";
    lastPulledAt: string;
}

export const syncMetaSchema = {
    title: "Sync Meta",
    version: 0,
    primaryKey: "id",
    type: "object",

    properties: {
        id: {
            type: "string",
            maxLength: 20,
        },

        lastPulledAt: {
            type: "string",
        },
    },

    required: [
        "id",
        "lastPulledAt",
    ],
};