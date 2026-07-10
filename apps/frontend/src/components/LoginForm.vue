<template>
  <form class="space-y-5" @submit.prevent="login">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Email
      </label>

      <input
        v-model="email"
        :disabled="loading"
        type="email"
        placeholder="you@example.com"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Password
      </label>

      <input
        v-model="password"
        :disabled="loading"
        type="password"
        placeholder="••••••••"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>

    <p
        v-if="errorMessage"
        class="text-sm text-red-500"
    >
    {{ errorMessage }}
    </p>

    <button
      type="submit"
      :disabled="loading"
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
    >
      <svg
        v-if="loading"
        class="h-5 w-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          opacity="0.25"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          stroke-width="4"
        />
      </svg>

      {{ loading ? "Logging in..." : "Login" }}
    </button>

    <p class="text-center text-sm text-slate-500">
      Don't have an account?

      <button
        type="button"
        :disabled="loading"
        class="font-semibold text-blue-600 hover:underline"
        @click="$emit('switch')"
      >
        Register
      </button>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import authService from "@/services/auth.service";
import { startHeartbeat } from "@/composables/useHeartbeat";
import profileService from "@/services/profile.service";
import syncService from "@/services/sync.service";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

async function login() {
  errorMessage.value = "";
  loading.value = true;

  try {
    const result = await authService.login(
      email.value,
      password.value
    );

    authStore.login(result.access_token);

    const user = await authService.profile();

    console.log("Profile from backend:", user);

    await profileService.updateProfile({
      username: user.username,
      email: user.email,
      isGuest: false,
    });

    const localProfile = await profileService.getProfile();
    console.log("Local profile: ", localProfile?.toJSON());

    await syncService.sync();

    startHeartbeat();

    router.push('/todos');
  } catch (error) {
    console.error(error);
    const apiMessage = (error as any)?.response?.data?.message;

    if (typeof apiMessage === "string") {
      errorMessage.value = apiMessage;
    } else if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = "Login failed.";
    }
  }finally{
    loading.value = false;
  }
}
</script>