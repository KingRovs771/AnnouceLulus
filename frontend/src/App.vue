<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
}
</style>
