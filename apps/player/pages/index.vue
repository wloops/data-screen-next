<template>
  <div class="dashboard-container" :style="layoutStyle">
    <DashboardHeader :layout-config="layoutConfig" />
    <DashboardContent :layout-config="layoutConfig" />
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '~/components/dashboard/Header.vue'
import DashboardContent from '~/components/dashboard/Content.vue'
import { computed } from 'vue'

const { data: layoutConfig } = await useFetch<any>('/layout.json')

// 计算布局样式
const bg_default_url = '/assets/background/'
const layoutStyle = computed(() => ({
  margin: layoutConfig.value?.layout?.style?.margin || '0',
  flexDirection: (layoutConfig.value?.layout?.direction || 'column') as 'row' | 'column' | 'row-reverse' | 'column-reverse',
  background: layoutConfig.value?.layout?.background?.image ? `url(${bg_default_url}${layoutConfig.value.layout.background.image}) no-repeat top center` : 'none',
  backgroundSize: '100% 100%',
}))
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  /* background: #0f1624; */
  color: #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.dashboard-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/background/bg_default.jpg') no-repeat top center;
  background-size: 100% 100%;
  opacity: 1;
  z-index: 0;
}

/* 确保内容在背景之上 */
:deep(*) {
  position: relative;
  z-index: 1;
}

/* 移除可能的默认边距 */
:deep(body),
:deep(html) {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
