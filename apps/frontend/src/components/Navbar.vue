<template>
  <header class="bg-white shadow-sm">
    <div
      class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-2 sm:gap-3">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 sm:h-10 sm:w-10"
        >
          <CheckSquare class="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </div>

        <h1 class="text-xl font-bold text-slate-800 sm:text-2xl">
          Todo PWA
        </h1>
      </div>

      <button
        @click="router.push('/settings')"
        class="rounded-xl p-2 transition hover:bg-slate-100"
      >
        <Settings class="h-6 w-6 text-slate-700" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CheckSquare, Settings } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
</script>