<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white font-bold"
        >
          ✓
        </div>

        <h1 class="text-3xl font-bold text-slate-800">
          Todo PWA
        </h1>

        <p class="mt-2 text-slate-500">
          {{
            isLogin
              ? "Sign in to continue."
              : "Create your account."
          }}
        </p>
      </div>

      <LoginForm
        v-if="isLogin"
        @switch="isLogin = false"
      />

      <RegisterForm
        v-else
        @switch="isLogin = true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

const isLogin = ref(true);
</script>