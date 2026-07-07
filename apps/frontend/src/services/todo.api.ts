import api from "./api";

class TodoApiService {
    async getTodos() {
        const response = await api.get("/todos");
        return response.data;
    }

    async createTodo(data: {
        title: string;
        description?: string;
    }) {
        const response = await api.post("/todos", data);
        return response.data;
    }

    async updateTodo(
        id: string,
        data: {
            title?: string;
            description?: string;
            completed?: boolean;
        },
    ) {
        const response = await api.patch(`/todos/${id}`, data);
        return response.data;
    }

    async deleteTodo(id: string) {
        await api.delete(`/todos/${id}`);
    }
}

export default new TodoApiService();