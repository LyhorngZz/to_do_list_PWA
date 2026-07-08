<template>
  <header class="bg-white shadow-sm">
    <div
      class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <!-- Logo -->
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

      <!-- Logout Button -->
      <button
        @click="logout"
        class="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:gap-2 sm:px-4 sm:text-base"
      >
        <LogOut class="h-4 w-4 sm:h-5 sm:w-5" />

        <span class="hidden sm:inline">
          Logout
        </span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CheckSquare, LogOut } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import todoService from "@/services/todo.service";

const router = useRouter();
const authStore = useAuthStore();

async function logout() {
  await todoService.clearLocalData();

  authStore.logout();

  router.push("/login");
}
</script>