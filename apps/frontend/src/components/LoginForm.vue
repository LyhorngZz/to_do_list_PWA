<template>
  <form class="space-y-5" @submit.prevent="login">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Email
      </label>

      <input
        v-model="email"
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
        class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-900 cursor-pointer"
    >
      Login
    </button>

    <p class="text-center text-sm text-slate-500">
      Don't have an account?

      <button
        type="button"
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

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

async function login() {
  errorMessage.value = "";
  try {
    const result = await authService.login(
      email.value,
      password.value
    );

    authStore.login(result.access_token);

    router.push("/todos");
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
  }
}
</script>