<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
  >
    <div class="flex justify-between">
      <div class="flex gap-4">
        <input
          type="checkbox"
          :checked="completed"
          class="mt-1 h-5 w-5 accent-blue-600 cursor-pointer"
          @change="emit('toggle')"
        />

        <div>
          <h3
            class="text-lg font-semibold"
            :class="
              completed
                ? 'text-slate-400 line-through'
                : 'text-slate-800'
            "
          >
            {{ title }}
          </h3>

          <p
            class="mt-1"
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

      <div class="flex items-start gap-2">
        <button
          class="flex items-center gap-2 rounded-xl border px-3 py-2 text-blue-600 hover:bg-blue-50"
          @click="emit('edit')"
        >
          <Pencil class="h-4 w-4" />
          Edit
        </button>

        <button
          class="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
          @click="emit('delete')"
        >
          <Trash2 class="h-6 w-6" />
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