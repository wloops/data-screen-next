<template>
  <div class="dashboard-container" :style="layoutStyle">
    <Header :layout-config="layoutConfig" :current-page="currentPage" v-model:newPage="currentPage" />
    <Content :layout-config="pageLayoutConfig" :page-config="currentPage" />
  </div>
</template>
,
<script setup lang="ts">
import { Header, Content } from '@repo/ui'
import { computed, ref, watch } from 'vue'
import type { Page } from '@repo/ui/src/types/layout'
import { usePublicFiles } from '@/composables/usePublicFiles'

const { data: layoutConfig } = await useFetch<any>('/layout.json')

// 添加 currentPage 状态
const currentPage = ref<Page>({} as Page)

// 在数据加载后设置默认页面
currentPage.value = layoutConfig.value?.pages?.[0]
console.log('currentPage', currentPage.value)

const pageLayoutConfig = ref<any>(null)
const getPageLayoutConfig = async (id: string) => {
  // 获取页面配置文件列表
  const { data: pageFiles } = await usePublicFiles('pages')
  console.log('可用的页面配置:', pageFiles.value)

  // 查询是否存在当前页面配置文件
  const pageLayoutConfigFile = pageFiles.value?.find((file) => file.id === id)?.path || '/pages/page__default.json'
  console.log('pageLayoutConfigFile', id, pageLayoutConfigFile)
  // 动态获取页面配置
  const { data: thisPageLayoutConfig } = pageLayoutConfigFile ? await useFetch<any>(pageLayoutConfigFile) : { data: ref(null) }
  pageLayoutConfig.value = thisPageLayoutConfig.value
}
// 更新页面配置
await getPageLayoutConfig(currentPage.value?.id)
watch(currentPage, (newPage) => {
  getPageLayoutConfig(newPage?.id)
})

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
