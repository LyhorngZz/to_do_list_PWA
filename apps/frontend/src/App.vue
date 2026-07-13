<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import syncService from "@/services/sync.service";
import { useAuthStore } from "./stores/auth";
import { startHeartbeat, stopHeartbeat } from "./composables/useHeartbeat";
import { checkPinGuard } from "./composables/usePinGuard";

const authStore = useAuthStore();

const handleOnline = async () => {
    await syncService.sync();
};

onMounted(async () => {
    await checkPinGuard();
    
    window.addEventListener("online", handleOnline);

    if(authStore.isAuthenticated){
        startHeartbeat();
    }
});

onUnmounted(() => {
    window.removeEventListener("online", handleOnline);

    stopHeartbeat();
});
</script>