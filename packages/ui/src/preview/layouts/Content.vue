<template>
  <main class="dashboard-content">
    <template v-for="page in layoutConfig?.pages" :key="page.id">
      <section v-show="currentPage?.id === page.id" class="page-container">
        <div class="grid-container">
          <div v-for="i in 9" :key="i" class="grid-item">
            <!-- 卡片内容 -->
            {{ currentPage?.id }}
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import type { LayoutConfig, Page } from '../../types/layout'

const props = defineProps<{
  layoutConfig: LayoutConfig
  currentPage?: Page
}>()

console.log('Content.vue currentPage', props.currentPage)
</script>

<style scoped>
.dashboard-content {
  height: calc(100vh - 60px);
  padding: 20px;
  display: flex;
}

.page-container {
  width: 100%;
  height: 100%;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  height: 100%;
}

.grid-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 15px;
}
</style>
