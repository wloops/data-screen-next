<template>
  <header class="dashboard-header" :style="layoutStyle">
    <HeaderLeft class="header-left" :currentPage="currentPage" :layoutConfig="layoutConfig" :fetch="header_fetch.left" />

    <HeaderCenter class="header-center" :selectedPageId="selectedPageId" :currentPage="currentPage" :layoutConfig="layoutConfig" :fetch="header_fetch.center" :handlePageChange="handlePageChange" />

    <HeaderRight class="header-right" :currentPage="currentPage" :layoutConfig="layoutConfig" :fetch="header_fetch.right" />
  </header>
</template>

<script setup lang="ts">
import type { Page, Tab, LayoutConfig } from '~/types/layout'

import HeaderLeft from './HeaderLeft.vue'
import HeaderRight from './HeaderRight.vue'
import HeaderCenter from './HeaderCenter.vue'

const props = defineProps<{
  layoutConfig: LayoutConfig
  currentPage?: Page
}>()

const emit = defineEmits<{
  'update:newPage': [Page | undefined]
}>()

const selectedPageId = ref('')
const handlePageChange = (pageId: string) => {
  selectedPageId.value = pageId
  // 找到对应的页面数据
  const newPage = props.layoutConfig?.pages?.find((p) => p.id === pageId)
  emit('update:newPage', newPage)
}

const bg_default_url = '/assets/background/'
const layoutStyle = computed(() => ({
  background: props.layoutConfig?.layout?.header?.background?.image ? `url(${bg_default_url}${props.layoutConfig.layout.header.background.image}) no-repeat` : 'none',
  backgroundSize: '100% 100%',
}))

const main_send = props.layoutConfig?.fecth?.send
const header_fetch: any = {
  main: [],
  left: [],
  right: [],
  center: [],
}
if (main_send && main_send.length > 0) {
  main_send.forEach((item: any) => {
    if (item.in.includes('header')) {
      header_fetch[item.in.split('-')[1]].push(item)
    }
  })
}

// 简化的模拟数据
const mockTabs: Tab[] = [
  { id: 'device1', name: '设备A' },
  { id: 'device2', name: '设备B' },
  { id: 'device3', name: '设备C' },
]

watch(
  () => props.currentPage,
  (newPage) => {
    if (newPage && newPage?.have_tabs) {
      newPage.tabs = mockTabs
    }
  },
  { immediate: true }
)

console.log('layoutConfig', props.layoutConfig)
console.log('currentPage', props.currentPage)

// const handleTabClick = (tabId: string) => {
//   currentTab.value = tabId
//   if (props.currentPage?.fecth) {
//     // 触发数据获取
//   }
// }

// 在 currentPage computed 变化时也发射
// watch(props.currentPage, (newPage) => {
//   emit('update:currentPage', newPage)
// })
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 80px;
}

.header-left,
.header-right {
  flex: 1;
  margin-top: -30px;
  display: flex;
  align-items: center;
}
.header-left {
  justify-content: flex-start;
  .alarm {
    margin-left: 10px;
    margin-right: 20px;
    .alarm-icon-wrapper {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}
.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 1;
  text-align: center;
  margin-bottom: 10px;
}
</style>
