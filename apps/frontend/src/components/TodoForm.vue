<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="space-y-4">
      <input
        v-model="title"
        type="text"
        placeholder="Task title..."
        class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
      />

      <textarea
        v-model="description"
        rows="3"
        placeholder="Task description..."
        class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
      />

      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-5 py-2 hover:bg-red-400 cursor-pointer"
          @click="emit('cancel')"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-900 cursor-pointer"
          @click="submit"
        >
          {{ todo ? "Update" : "Save" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { TodoDocType } from "@/database/schemas/todo.schema";
import type { CreateTodoDto } from "@/types/create-todo.dto";

const props = defineProps<{
  todo?: TodoDocType | null;
}>();

const emit = defineEmits<{
  (e: "save", todo: TodoDocType | CreateTodoDto): void;
  (e: "cancel"): void;
}>();

const title = ref("");
const description = ref("");

watch(
  () => props.todo,
  (todo) => {
    title.value = todo?.title ?? "";
    description.value = todo?.description ?? "";
  },
  { immediate: true }
);

function submit() {
  console.log("Submit clicked");

  if (!title.value.trim()) {
    console.log("Title is empty");
    return;
  }

  if (props.todo) {
    console.log("Editing todo");

    emit("save", {
      ...props.todo,
      title: title.value,
      description: description.value,
    });
  } else {
    console.log("Creating todo");

    emit("save", {
      title: title.value,
      description: description.value,
    });
  }

  title.value = "";
  description.value = "";
}
</script>