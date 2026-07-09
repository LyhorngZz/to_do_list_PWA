<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import syncService from "@/services/sync.service";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

const handleOnline = () => {
    syncService.sync();
};

onMounted(() => {
    window.addEventListener("online", handleOnline);
});

onUnmounted(() => {
    window.removeEventListener("online", handleOnline);
});

onMounted(() => {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
    }
});
</script>