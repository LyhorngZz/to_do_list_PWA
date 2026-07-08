import db from "@/database";
import type { TodoDocType } from "@/database/schemas/todo.schema";

class TodoService {
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

    async addTodo(title: string, description: string) {
        console.log("TodoService.addTodo()");

        return await db.todos!.insert({
            id: crypto.randomUUID(),
            title,
            description,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            syncStatus: "pending",
            deleted: false,
        });
    }

    async updateTodo(todo: TodoDocType) {
        const doc = await db.todos.findOne({
            selector: {
                id: todo.id,
            },
        }).exec();

        if (!doc) return;

        await doc.incrementalPatch({
            title: todo.title,
            description: todo.description,
            updatedAt: new Date().toISOString(),
            syncStatus: "pending",
        });
    }

    async toggleComplete(id: string) {
        const doc = await db.todos.findOne({
            selector: {
                id,
            },
        }).exec();

        if (!doc) return;

        await doc.incrementalPatch({
            completed: !doc.completed,
            updatedAt: new Date().toISOString(),
            syncStatus: "pending",
        });
    }

    async deleteTodo(id: string) {
        const doc = await db.todos.findOne({
            selector: {
                id,
            },
        }).exec();

        if (!doc) return;

        await doc.incrementalPatch({
            deleted: true,
            updatedAt: new Date().toISOString(),
            syncStatus: "pending",
        });
    }
}

export default new TodoService();