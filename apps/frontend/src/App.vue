<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import syncService from "@/services/sync.service";

const handleOnline = () => {
    syncService.sync();
};

onMounted(() => {
    window.addEventListener("online", handleOnline);
});

onUnmounted(() => {
    window.removeEventListener("online", handleOnline);
});
</script>