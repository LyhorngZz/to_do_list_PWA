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
        v-if="error"
        class="text-sm text-red-500"
    >
    {{ error }}
    </p>

    <button
        type="submit"
        class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
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

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");

function login() {
  error.value = "";

  if (!email.value.trim() || !password.value.trim()) {
    error.value = "Please enter your email and password.";
    return;
  }

  authStore.login();
  router.push("/todos");
}
</script>