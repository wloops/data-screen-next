<template>
  <div class="dashboard-container" :style="layoutStyle">
    <DashboardHeader :layout-config="layoutConfig" :current-page="currentPage" v-model:newPage="currentPage" />
    <DashboardContent :layout-config="layoutConfig" :current-page="currentPage" />
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '~/components/dashboard/Header.vue'
import DashboardContent from '~/components/dashboard/Content.vue'
import { computed, ref, watch } from 'vue'
import type { Page } from '~/types/layout'

const { data: layoutConfig } = await useFetch<any>('/layout.json')

// 添加 currentPage 状态
const currentPage = ref<Page>()

// 在数据加载后设置默认页面
currentPage.value = layoutConfig.value?.pages?.[0]
console.log('currentPage', currentPage.value)

// 计算布局样式
const bg_default_url = '/assets/background/'
const layoutStyle = computed(() => ({
  margin: layoutConfig.value?.layout?.main?.style?.margin || '0',
  flexDirection: (layoutConfig.value?.layout?.main?.direction || 'column') as 'row' | 'column' | 'row-reverse' | 'column-reverse',
  background: layoutConfig.value?.layout?.main?.background?.image ? `url(${bg_default_url}${layoutConfig.value.layout.main.background.image}) no-repeat top center` : 'none',
  backgroundSize: '100% 100%',
}))
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  /* background: #0f1624; */
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: url('/assets/background/bg_default.jpg') no-repeat top center;
  background-size: 100% 100%;
}

/* 移除可能的默认边距 */
:deep(body),
:deep(html) {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
