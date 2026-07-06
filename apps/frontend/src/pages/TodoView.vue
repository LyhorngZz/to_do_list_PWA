<template>
  <div class="min-h-screen bg-slate-100">
    <Navbar />

    <main class="mx-auto max-w-6xl px-6 py-10">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-slate-800">
            My To-Do List
          </h1>

          <p class="mt-2 text-slate-500">
            Stay organized and get things done.
          </p>
        </div>

        <button
          v-if="!showForm"
          @click="openAddForm"
          class="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow transition hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      <!-- Todo Form -->
      <div class="mb-5">
        <TodoForm
            v-if="showForm"
            :todo="editingTodo"
            @save="saveTodo"
            @cancel="cancelForm"
        />
      </div>

      <!-- Todo Card List -->
      <div
        v-if="todos.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center"
      >
        <h2 class="text-xl font-semibold text-slate-800">
            No tasks yet
        </h2>

        <p class="mt-2 max-w-sm text-slate-500">
            You don't have any tasks yet. Click
            <span class="font-medium text-blue-600">"Add Task"</span>
            to create your first todo.
        </p>
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <TodoCard
            v-for="todo in todos"
            :key="todo.id"
            :title="todo.title"
            :description="todo.description"
            :completed="todo.completed"
            @toggle="toggleComplete(todo.id)"
            @edit="editTodo(todo)"
            @delete="deleteTodo(todo.id)"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import TodoCard from "@/components/TodoCard.vue";
import TodoForm from "@/components/TodoForm.vue";
import type { Todo } from "@/types/todo";

const todos = ref<Todo[]>([
  {
    id: 1,
    title: "Learn Vue",
    description: "Practice Composition API",
    completed: false,
  },
]);

const showForm = ref(false);
const editingTodo = ref<Todo | null>(null);

function addTodo(todo: Omit<Todo, "id">) {
  todos.value.unshift({
    id: Date.now(),
    ...todo,
  });

  showForm.value = false;
  editingTodo.value = null;
}

function updateTodo(todo: Todo) {
  const index = todos.value.findIndex(t => t.id === todo.id);

  if (index !== -1)
    todos.value[index] = todo;

  editingTodo.value = null;
  showForm.value = false;
}

function deleteTodo(id: number) {
  todos.value = todos.value.filter(t => t.id !== id);
}

function toggleComplete(id: number) {
  const todo = todos.value.find(t => t.id === id);

  if (todo)
    todo.completed = !todo.completed;
}

function editTodo(todo: Todo) {
  editingTodo.value = { ...todo };
  showForm.value = true;
}

function openAddForm() {
  editingTodo.value = null;
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
  editingTodo.value = null;
}

function saveTodo(todo: Todo | Omit<Todo, "id">) {
  if (editingTodo.value) {
    updateTodo(todo as Todo);
  } else {
    addTodo(todo as Omit<Todo, "id">);
  }
}
</script>