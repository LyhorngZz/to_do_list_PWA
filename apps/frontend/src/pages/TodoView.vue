<template>
  <div class="min-h-screen bg-slate-100">
    <Navbar />

    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <!-- Header -->
      <div
        class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-3xl font-bold text-slate-800 sm:text-4xl">
            My To-Do List
          </h1>

          <p class="mt-2 text-sm text-slate-500 sm:text-base">
            Stay organized and get things done.
          </p>
        </div>

        <button
          v-if="!showForm"
          @click="openAddForm"
          class="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow transition hover:bg-blue-700 cursor-pointer"
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
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-10 text-center"
      >
        <h2 class="text-lg sm:text-xl font-semibold text-slate-800">
            No tasks yet
        </h2>

        <p class="mt-2 max-w-sm text-slate-500 sm:text-base">
            You don't have any tasks yet. Click
            <span class="font-medium text-blue-600">"Add Task"</span>
            to create your first todo.
        </p>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <TodoCard
            v-for="todo in todos"
            :key="todo.id"
            :title="todo.title"
            :description="todo.description"
            :completed="todo.completed"
            @toggle="toggleComplete(todo)"
            @edit="editTodo(todo)"
            @delete="deleteTodo(todo)"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Subscription } from "rxjs";
import Navbar from "@/components/Navbar.vue";
import TodoCard from "@/components/TodoCard.vue";
import TodoForm from "@/components/TodoForm.vue";
import type { TodoDocType } from "@/database/schemas/todo.schema";
import todoService from "@/services/todo.service";
import type { CreateTodoDto } from "@/types/create-todo.dto";
import syncService from "@/services/sync.service";

const todos = ref<TodoDocType[]>([]);

const showForm = ref(false);
const editingTodo = ref<TodoDocType | null>(null);

let subscription: Subscription | undefined;

onMounted(async () => {
    subscription = todoService
        .getTodoStream()
        .subscribe((docs) => {
            todos.value = docs.map(doc => doc.toJSON());
        });

    try {
        await syncService.initialize();
    } catch (error) {
        console.error(error);
    }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

async function addTodo(todo: CreateTodoDto) {
    try {
        await todoService.addTodo(
            todo.title,
            todo.description,
        );

        syncService.sync();
    } finally {
        cancelForm();
    }
}

async function updateTodo(todo: TodoDocType) {
  try{
    await todoService.updateTodo(todo);
    syncService.sync();
  }finally{
    cancelForm();
  }
}

async function deleteTodo(todo: TodoDocType) {
  await todoService.deleteTodo(todo);
  syncService.sync();
}

async function toggleComplete(todo: TodoDocType) {
  await todoService.toggleComplete(todo);
  syncService.sync();
}

function editTodo(todo: TodoDocType) {
  editingTodo.value = { ...todo };
  showForm.value = true;
}

function openAddForm() {
  editingTodo.value = null;
  showForm.value = true;
}

function cancelForm() {
  editingTodo.value = null;
  showForm.value = false;
}

async function saveTodo(todo: TodoDocType | CreateTodoDto) {

  if (editingTodo.value) {
    await updateTodo(todo as TodoDocType);
  } else {
    await addTodo(todo as CreateTodoDto);
  }
}
</script>