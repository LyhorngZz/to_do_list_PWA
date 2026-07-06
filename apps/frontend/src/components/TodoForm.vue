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
          class="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100"
          @click="emit('cancel')"
        >
          Cancel
        </button>

        <button
          class="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
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
import type { Todo } from "@/types/todo";

const props = defineProps<{
  todo?: Todo | null;
}>();

const emit = defineEmits<{
  (e: "save", todo: Todo | Omit<Todo, "id">): void;
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
  if (!title.value.trim()) return;

  if (props.todo) {
    emit("save", {
      ...props.todo,
      title: title.value,
      description: description.value,
    });
  } else {
    emit("save", {
      title: title.value,
      description: description.value,
      completed: false,
    });
  }

  title.value = "";
  description.value = "";
}
</script>