<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

      <!-- Title -->
      <h1 class="mb-2 text-center text-3xl font-bold text-slate-800">
        Continue as Guest
      </h1>

      <p class="mb-8 text-center text-slate-500">
        Enter a username to start using Todo PWA offline.
      </p>

      <!-- Username -->
      <input
        v-model="username"
        type="text"
        placeholder="Enter your username"
        class="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <!-- Continue -->
      <button
        @click="continueAsGuest"
        :disabled="!username.trim()"
        class="mb-3 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        Continue
      </button>

      <!-- Back -->
      <button
        @click="router.push('/login')"
        class="w-full rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Back to Login
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import profileService from "@/services/profile.service";

const router = useRouter();

const username = ref("");

async function continueAsGuest() {
  await profileService.createGuestProfile(
    username.value.trim()
  );

  router.push("/todos");
}
</script>