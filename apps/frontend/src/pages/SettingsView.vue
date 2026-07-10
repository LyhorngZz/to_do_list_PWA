<template>
  <div class="min-h-screen bg-slate-100">
    <div class="mx-auto max-w-xl p-6">

    <div class="mb-6 flex items-center gap-3">
    <button
        @click="goBack"
        class="rounded-lg p-2 transition hover:bg-slate-200"
    >
        <ArrowLeft class="h-5 w-5 text-slate-700" />
    </button>

    <h1 class="text-3xl font-bold">
        Settings
    </h1>
    </div>

      <!-- Profile -->
      <div class="mb-6 rounded-xl bg-white p-5 shadow">
        <h2 class="mb-4 text-lg font-semibold">
          Profile
        </h2>

        <div class="mb-3">
          <p class="text-sm text-slate-500">Username</p>
          <p class="font-medium">
            {{ profile?.username }}
          </p>
        </div>

        <div>
          <p class="text-sm text-slate-500">Email</p>
          <p class="font-medium">
            {{ profile?.email || "Guest" }}
          </p>
        </div>
      </div>

      <!-- Security -->
      <div class="mb-6 rounded-xl bg-white p-5 shadow">
        <h2 class="mb-4 text-lg font-semibold">
          Security
        </h2>

        <button
          class="w-full rounded-lg border p-3 hover:bg-green-100 cursor-pointer"
        >
          Create Passcode
        </button>
      </div>

      <!-- Account -->
      <div class="rounded-xl bg-white p-5 shadow">

        <h2 class="mb-4 text-lg font-semibold">
          Account
        </h2>

        <button
          v-if="!authStore.isAuthenticated"
          @click="router.push({
            path: '/login',
            query: {
              from: 'settings',
            },
          })"
          class="mb-3 w-full rounded-lg border p-3 cursor-pointer hover:text-white hover:bg-blue-600 hover:border-none"
        >
          Login
        </button>

        <button
          v-else
          @click="logout"
          class="w-full rounded-lg bg-red-500 p-3 text-white cursor-pointer hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";
import profileService from "@/services/profile.service";
import { stopHeartbeat } from "@/composables/useHeartbeat";
import { ArrowLeft } from "lucide-vue-next";

import type { ProfileDocType } from "@/database/schemas/profile.schema";
import todoService from "@/services/todo.service";

const profile = ref<ProfileDocType | null>(null);

const router = useRouter();

const authStore = useAuthStore();

onMounted(async () =>{
    profile.value = await profileService.getProfile();
});

async function logout() {

  await todoService.clearLocalData();

  await profileService.clearProfile();

    stopHeartbeat();

    authStore.logout();

    router.replace("/login");
}

function goBack() {
    router.back();
}
</script>