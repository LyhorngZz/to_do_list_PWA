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
            mode === "login"
              ? "Sign in to continue."
              : "Create your account."
          }}
        </p>
      </div>

      <LoginForm
        v-if="mode === 'login'"
        @switch="mode = 'register'"
      />

      <RegisterForm
        v-else-if="mode === 'register'"
        @switch="mode = 'login'"
      />

      <div
          v-if="showGuestButton"
          class="mt-6 border-t pt-6"
      >
          <button
              @click="router.push('/guest')"
              class="w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-blue-200"
          >
              Continue as Guest
          </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const mode = ref<"login" | "register">(
    route.query.mode === "register" ? "register" : "login"
);

const showGuestButton = computed(() => {
    return route.query.from !== "settings";
});
</script>