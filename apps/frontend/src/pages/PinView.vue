<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4">

    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

      <h1 class="text-center text-3xl font-bold text-slate-800">
        Enter Passcode
      </h1>

      <p class="mt-2 mb-8 text-center text-slate-500">
        Enter your 6-digit passcode to continue.
      </p>

      <input
        v-model="pin"
        maxlength="6"
        inputmode="numeric"
        type="password"
        placeholder="••••••"
        class="mb-4 w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-2xl tracking-[0.8em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <p
        v-if="errorMessage"
        class="mb-4 text-center text-sm text-red-500"
      >
        {{ errorMessage }}
      </p>

      <button
        :disabled="loading"
        @click="verifyPin"
        class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
      >
        {{ loading ? "Verifying..." : "Unlock" }}
      </button>

      <button
        @click="loginAnotherAccount"
        class="mt-4 w-full rounded-xl border border-slate-300 py-3 font-medium transition hover:bg-slate-100"
      >
        Login another account
      </button>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import authService from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth";

import todoService from "@/services/todo.service";
import profileService from "@/services/profile.service";
import { stopHeartbeat } from "@/composables/useHeartbeat";
import bcrypt from "bcryptjs";

const router = useRouter();
const authStore = useAuthStore();

const pin = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function verifyPin() {

    errorMessage.value = "";

    if (!/^[0-9]{6}$/.test(pin.value)) {
        errorMessage.value = "PIN must contain 6 digits.";
        return;
    }

    loading.value = true;

    try {

        await authService.verifyPin(pin.value);

        const pinHash = await bcrypt.hash(
            pin.value,
            10,
        );

        await profileService.updateProfile({
            hasPin: true,
            pinHash,
        });

        authStore.unlockPin();

        router.replace("/todos");

    }catch (error: any) {

      if (error.response) {
          errorMessage.value =
              error.response.data.message;
          return;
      }

      const profile = await profileService.getProfile();

      if (!profile?.pinHash) {
          errorMessage.value =
              "Offline verification is unavailable.";
          return;
      }

      const matched = await bcrypt.compare(
          pin.value,
          profile.pinHash,
      );

      if (!matched) {
          errorMessage.value = "Incorrect PIN.";
          return;
      }

      authStore.unlockPin();
      router.replace("/todos");
      
    } finally {

        loading.value = false;

    }

}

async function loginAnotherAccount() {

    await todoService.clearLocalData();

    await profileService.clearProfile();

    stopHeartbeat();

    authStore.logout();

    router.replace("/login");

}
</script>