export interface PushTodo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    deleted: boolean;
    updatedAt: string;
}

export interface PullTodo {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PushChanges {
    todos: {
        created: PushTodo[];
        updated: PushTodo[];
        deleted: PushTodo[];
    };
}

export interface SyncChanges {
    todos: {
        created: PullTodo[];
        updated: PullTodo[];
        deleted: PullTodo[];
    };
}

export interface PullResponse {
    timestamp: string;
    changes: SyncChanges;
}

export interface PushRequest {
    changes: PushChanges;
}

export interface PushResponse {
    success: boolean;
}