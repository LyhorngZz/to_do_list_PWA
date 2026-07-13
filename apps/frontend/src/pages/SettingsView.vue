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
      <div
        v-if="authStore.isAuthenticated"
        class="mb-6 rounded-xl bg-white p-5 shadow"
      >
        <h2 class="mb-4 text-lg font-semibold">
          Security
        </h2>

        <div class="mb-5">
          <p class="font-medium">
            Passcode
          </p>

          <p class="mt-1 text-sm text-slate-500">
            Protect your app with a 6-digit PIN. The PIN will be required whenever
            the app is locked or reopened.
          </p>
        </div>

        <div class="mb-5 flex items-center justify-between">

          <span class="text-sm text-slate-500">
            Status
          </span>

          <span
            v-if="!profile?.hasPin"
            class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
          >
            Not Configured
          </span>

          <span
            v-else
            class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
          >
            ✓ Enabled
          </span>

        </div>

        <p
          v-if="successMessage"
          class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {{ successMessage }}
        </p>

        <p
          v-if="errorMessage"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ errorMessage }}
        </p>

        <!-- Create -->
        <button
          v-if="!profile?.hasPin && !showCreatePin"
          @click="showCreatePin = true"
          class="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Create Passcode
        </button>

        <!-- Change -->
        <button
          v-else-if="profile?.hasPin"
          class="w-full rounded-lg border py-3 transition hover:bg-slate-100"
        >
          Change Passcode
        </button>

        <!-- Create Form -->
        <div
          v-if="showCreatePin"
          class="mt-5 space-y-4 border-t pt-5"
        >

          <input
            v-model="pin"
            maxlength="6"
            @input="pin = pin.replace(/\D/g, '')"
            type="password"
            placeholder="Enter 6-digit PIN"
            class="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <input
            v-model="confirmPin"
            maxlength="6"
            @input="pin = pin.replace(/\D/g, '')"
            type="password"
            placeholder="Confirm PIN"
            class="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <div class="flex gap-3">

            <button
              :disabled="loadingPin"
              @click="createPin"
              class="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
            >
              {{ loadingPin ? "Saving..." : "Save" }}
            </button>

            <button
              :disabled="loadingPin"
              @click="cancelCreatePin"
              class="flex-1 rounded-lg border py-3 transition hover:bg-slate-100"
            >
              Cancel
            </button>

          </div>

        </div>

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
import profileApi from "@/services/profile.api";
import bcrypt from "bcryptjs";

const profile = ref<ProfileDocType | null>(null);
const showCreatePin = ref(false);
const loadingPin = ref(false);

const pin = ref("");
const confirmPin = ref("");

const successMessage = ref("");
const errorMessage = ref("");

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

function cancelCreatePin() {

    showCreatePin.value = false;

    pin.value = "";
    confirmPin.value = "";

    errorMessage.value = "";
    successMessage.value = "";
}

async function createPin() {

    successMessage.value = "";
    errorMessage.value = "";

    if (!/^\d{6}$/.test(pin.value)) {
        errorMessage.value =
            "PIN must contain exactly 6 digits.";
        return;
    }

    if (pin.value !== confirmPin.value) {
        errorMessage.value =
            "PIN does not match.";
        return;
    }

    loadingPin.value = true;

    try {

        await profileApi.createPin(pin.value);

        const pinHash = await bcrypt.hash(pin.value, 10);

        await profileService.updateProfile({
            hasPin: true,
            pinHash,
        });

        profile.value = await profileService.getProfile();

        successMessage.value =
            "Passcode created successfully.";

        showCreatePin.value = false;
        pin.value = "";
        confirmPin.value = "";

    } catch (error: any) {

        errorMessage.value =
            error.response?.data?.message ??
            "Unable to create passcode.";

    } finally {

        loadingPin.value = false;

    }

}
</script>