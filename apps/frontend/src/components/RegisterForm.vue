<template>
  <form class="space-y-5" @submit.prevent="register">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Username
      </label>

      <input
        v-model="username"
        type="text"
        placeholder="John Doe"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>

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

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Confirm Password
      </label>

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="••••••••"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>

    <p
      v-if="successMessage"
      class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-600"
    >
      {{ successMessage }}
    </p>

    <p
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600"
    >
      {{ errorMessage }}
    </p>

    <button
        type="submit"
        class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      Register
    </button>

    <p class="text-center text-sm text-slate-500">
      Already have an account?

      <button
        type="button"
        class="font-semibold text-blue-600 hover:underline"
        @click="$emit('switch')"
      >
        Login
      </button>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import authService from "@/services/auth.service";

const emit = defineEmits(["switch"]);

// const router = useRouter();
// const authStore = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");

async function register() {
  try {
    await authService.register(
      username.value,
      email.value,
      password.value
    );

    successMessage.value = "Registration successful. Please login.";

    setTimeout(() => {
      emit("switch");
    }, 1500);

  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Registration failed.";
  }
}
</script>