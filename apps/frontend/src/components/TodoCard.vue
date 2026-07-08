<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
  >
    <div class="flex items-start justify-between gap-3">
      <!-- Left -->
      <div class="flex min-w-0 flex-1 gap-3 sm:gap-4">
        <input
          type="checkbox"
          :checked="completed"
          class="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
          @change="emit('toggle')"
        />

        <div class="min-w-0">
          <h3
            class="break-words text-base font-semibold sm:text-lg"
            :class="
              completed
                ? 'text-slate-400 line-through'
                : 'text-slate-800'
            "
          >
            {{ title }}
          </h3>

          <p
            class="mt-1 break-words text-sm sm:text-base"
            :class="
              completed
                ? 'text-slate-400'
                : 'text-slate-500'
            "
          >
            {{ description }}
          </p>
        </div>
      </div>

      <!-- Right -->
      <div class="flex shrink-0 items-start gap-1 sm:gap-2">
        <button
          class="flex items-center gap-1 rounded-lg border px-2 py-2 text-blue-600 transition hover:bg-blue-50 sm:gap-2 sm:rounded-xl sm:px-3"
          @click="emit('edit')"
        >
          <Pencil class="h-4 w-4" />

          <span class="hidden sm:inline">
            Edit
          </span>
        </button>

        <button
          class="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 sm:rounded-xl"
          @click="emit('delete')"
        >
          <Trash2 class="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";

defineProps<{
  title: string;
  description: string;
  completed: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "edit"): void;
  (e: "delete"): void;
}>();
</script>