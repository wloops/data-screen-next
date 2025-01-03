<template>
  <div class="dashboard-container">
    <DashboardHeader />
    <DashboardContent />
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import DashboardContent from '~/components/dashboard/DashboardContent.vue'
</script>

<style scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
  background: #0f1624;
  color: #fff;
}
</style>
