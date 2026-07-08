<template>
  <header class=" h-[80px] bg-white shadow-sm">
    <div
      class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600"
        >
          <CheckSquare class="h-6 w-6 text-white" />
        </div>

        <h1 class="text-2xl font-bold text-slate-800">
          Todo PWA
        </h1>
      </div>

      <button
        @click="logout"
        class="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 font-medium text-red-600 transition hover:bg-red-50"
      >
        <LogOut class="h-5 w-5" />
        Logout
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CheckSquare, LogOut } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

import todoService from "@/services/todo.service";

async function logout() {
    await todoService.clearLocalData();

    authStore.logout();

    router.push("/login");
}
</script>