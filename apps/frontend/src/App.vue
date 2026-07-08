<script setup lang="ts">
import { onMounted } from 'vue';
import api from './services/api';

onMounted(async () => {
  try {
    const response = await api.get('/');

    console.log(response.data);
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <RouterView />
</template>