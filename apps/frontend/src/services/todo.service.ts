import db from "@/database";
import type { TodoDocType } from "@/database/schemas/todo.schema";
import todoApi from "./todo.api";

class TodoService {
    private async enqueue(
        documentId: string,
        operation: "create" | "update" | "delete",
    ) {
        const queue = db.syncQueue!;

        const existing = await queue.findOne(documentId).exec();

        // No existing queue item
        if (!existing) {
            await queue.insert({
                documentId,
                collection: "todos",
                operation,
                timestamp: new Date().toISOString(),
            });

            return;
        }

        switch (existing.operation) {
            case "create":
                switch (operation) {
                    case "update":
                        // Still a create because the backend doesn't know about it yet.
                        return;

                    case "delete":
                        // Created then deleted before syncing.
                        // Nothing needs to be sent.
                        await existing.remove();
                        return;

                    default:
                        return;
                }

            case "update":
                switch (operation) {
                    case "update":
                        // Already pending update.
                        return;

                    case "delete":
                        // Update becomes delete.
                        await existing.incrementalPatch({
                            operation: "delete",
                            timestamp: new Date().toISOString(),
                        });
                        return;

                    default:
                        break;
                }
                break;

            case "delete":
                // Ignore any further changes after delete.
                return;
        }

        // Fallback
        await existing.incrementalPatch({
            operation,
            timestamp: new Date().toISOString(),
        });
    }

    async initialize() {
        if (!navigator.onLine) {
            console.log("Offline: Using local IndexedDB");
            return;
        }

        try {
            console.log("Downloading todos from backend...");

            // Later replace with syncService.pull()
            const serverTodos = await todoApi.getTodos();

            await this.clearLocalData();

            // Insert backend todos
            for (const todo of serverTodos) {
                await db.todos.insert({
                    id: todo.id,
                    title: todo.title,
                    description: todo.description,
                    completed: todo.completed,

                    createdAt: new Date(todo.createdAt).toISOString(),
                    updatedAt: new Date(todo.updatedAt).toISOString(),

                    deleted: false,
                });
            }

            console.log("Initial sync completed.");
        } catch (error) {
            console.error("Initial sync failed:", error);
        }
    }

    async clearLocalData() {
        const todos = await db.todos.find().exec();

        for (const todo of todos) {
            await todo.remove();
        }

        const queue = await db.syncQueue.find().exec();

        for (const item of queue) {
            await item.remove();
        }
    }

    getTodoStream() {
        return db.todos!
            .find({
                selector: {
                    deleted: false,
                },
                sort: [
                    {
                        createdAt: "desc",
                    },
                ],
            })
            .$;
    }

    async getPendingQueue() {
        return db.syncQueue.find().exec();
    }

    async clearQueue() {
        const queue = await db.syncQueue.find().exec();

        for (const item of queue) {
            await item.remove();
        }
    }

    async getTodoById(id: string) {
        return db.todos.findOne(id).exec();
    }

    async addTodo(title: string, description: string) {
        const todo = await db.todos!.insert({
            id: crypto.randomUUID(),
            title,
            description,
            completed: false,
            deleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        await this.enqueue(todo.id, "create");

        return todo;
    }

    async updateTodo(todo: TodoDocType) {
        const doc = await db.todos.findOne(todo.id).exec();

        if (!doc) return;

        await doc.incrementalPatch({
            title: todo.title,
            description: todo.description,
            updatedAt: new Date().toISOString(),
        });

        await this.enqueue(todo.id, "update");
    }

    async toggleComplete(todo: TodoDocType) {
        const doc = await db.todos.findOne(todo.id).exec();

        if (!doc) return;

        await doc.incrementalPatch({
            completed: !doc.completed,
            updatedAt: new Date().toISOString(),
        });

        await this.enqueue(todo.id, "update");
    }

    async deleteTodo(todo: TodoDocType) {
        const doc = await db.todos.findOne(todo.id).exec();

        if (!doc) return;

        await doc.incrementalPatch({
            deleted: true,
            updatedAt: new Date().toISOString(),
        });

        await this.enqueue(todo.id, "delete");
    }
}

export default new TodoService();