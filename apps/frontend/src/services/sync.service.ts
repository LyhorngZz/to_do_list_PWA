import type { PullResponse, PushChanges, PushTodo, SyncChanges } from "@/types/sync";

import db from "@/database";

import syncApi from "./sync.api";
import todoService from "./todo.service";

class SyncService {

    async initialize() {
        await this.sync();
    }

    private syncing = false;

    async sync() {
        console.log("SYNC Start");
        if (this.syncing) {
            return;
        }

        this.syncing = true;

        try {
            if (!navigator.onLine) {
                return;
            }
            await this.push();
            await this.pull();
        } finally {
            this.syncing = false;
        }

        console.log("Sync end");
    }

    async push() {
        console.log("Push Start");
        const queue = await todoService.getPendingQueue();

        console.log(queue);

        if (queue.length === 0) {
            console.log("No pending changes.");
            return;
        }

        const changes: PushChanges = {
            todos: {
                created: [],
                updated: [],
                deleted: [],
            },
        };

        for (const item of queue) {
            const todo = await todoService.getTodoById(item.documentId);

            if (!todo) {
                continue;
            }

            const data = todo.toJSON();

            const syncTodo: PushTodo = {
                id: data.id,
                title: data.title,
                description: data.description,
                completed: data.completed,
                deleted: data.deleted,
                updatedAt: data.updatedAt,
            };

            switch (item.operation) {
                case "create":
                    changes.todos.created.push(syncTodo);
                    break;

                case "update":
                    changes.todos.updated.push(syncTodo);
                    break;

                case "delete":
                    changes.todos.deleted.push(syncTodo);
                    break;
            }
        }

        try {
            await syncApi.push(changes);

            await todoService.clearQueue();

            console.log("Push completed.");
        } catch (error: any) {
            console.error("Push failed.");
            console.error(error.response?.data);
        }
    }

    async pull() {
        try {
            const lastPulledAt = await this.getLastPulledAt();

            const response: PullResponse = await syncApi.pull(lastPulledAt);

            const {
                created,
                updated,
                deleted,
            } = response.changes.todos;

            // Insert new todos
            for (const todo of created) {
                const existing = await todoService.getTodoById(todo.id);

                if (existing) {
                    continue;
                }

                await db.todos.insert({
                    id: todo.id,
                    title: todo.title,
                    description: todo.description ?? "",
                    completed: todo.completed,
                    deleted: todo.deleted,
                    createdAt: todo.createdAt,
                    updatedAt: todo.updatedAt,
                });
            }

            // Update existing todos
            for (const todo of updated) {
                const existing = await todoService.getTodoById(todo.id);

                if (!existing) {
                    await db.todos.insert({
                        id: todo.id,
                        title: todo.title,
                        description: todo.description ?? "",
                        completed: todo.completed,
                        deleted: todo.deleted,
                        createdAt: todo.createdAt,
                        updatedAt: todo.updatedAt,
                    });

                    continue;
                }

                await existing.incrementalPatch({
                    title: todo.title,
                    description: todo.description ?? "",
                    completed: todo.completed,
                    deleted: todo.deleted,
                    updatedAt: todo.updatedAt,
                });
            }

            // Apply deletions
            for (const todo of deleted) {
                const existing = await todoService.getTodoById(todo.id);

                if (!existing) {
                    continue;
                }

                await existing.incrementalPatch({
                    deleted: true,
                    updatedAt: todo.updatedAt,
                });
            }

            await this.setLastPulledAt(response.timestamp);

            console.log("Pull completed.");
        } catch (error: any) {
            console.error("Pull failed.");
            console.error("Status:", error.response?.status);
            console.error("Response:", error.response?.data);
        }
    }

    private async getLastPulledAt(): Promise<string | null> {
        const meta = await db.syncMeta
            .findOne("sync")
            .exec();

        return meta?.lastPulledAt ?? null;
    }

    private async setLastPulledAt(
        timestamp: string,
    ): Promise<void> {

        const meta = await db.syncMeta
            .findOne("sync")
            .exec();

        if (meta) {
            await meta.incrementalPatch({
                lastPulledAt: timestamp,
            });

            return;
        }

        await db.syncMeta.insert({
            id: "sync",
            lastPulledAt: timestamp,
        });
    }
}

export default new SyncService();