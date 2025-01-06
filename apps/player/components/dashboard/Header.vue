<template>
  <header class="dashboard-header">
    <!-- 左侧 tabs -->
    <div class="header-left">
      <div v-if="currentPage?.have_tabs" class="header-tabs">
        <div v-for="tab in currentPage.tabs" :key="tab.id" :class="['tab-item', { active: currentTab === tab.id }]" @click="handleTabClick(tab.id)">
          <span>{{ tab.name }}</span>
        </div>
      </div>
    </div>

    <!-- 中间标题 -->
    <div class="header-center">
      <div class="title-select" @click="showPageSelect = !showPageSelect">
        <h1 class="title">{{ currentPage?.name || '告警信息' }}</h1>
        <Icon name="mdi:chevron-down" class="select-icon" :class="{ 'rotate-180': showPageSelect }" />

        <!-- 下拉菜单 -->
        <div v-if="showPageSelect" class="page-select-dropdown" v-on-click-outside="closePageSelect">
          <div v-for="page in layoutConfig?.pages" :key="page.id" class="page-option" :class="{ active: currentPage?.id === page.id }" @click="handlePageChange(page.id)">
            {{ page.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧时间和操作 -->
    <div class="header-right">
      <div class="time-wrapper">
        <span class="time">{{ currentTime }}</span>
        <div class="icons">
          <Icon name="mdi:refresh" class="icon" />
          <Icon name="mdi:fullscreen" class="icon" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { vOnClickOutside } from '@vueuse/components'
import type { Page, Tab, LayoutConfig } from '~/types/layout'

const props = defineProps<{
  layoutConfig: LayoutConfig
}>()

const route = useRoute()
const router = useRouter()
const currentTab = ref('')
const currentTime = ref('')
const showPageSelect = ref(false)

// 简化的模拟数据
const mockTabs = [
  { id: 'device1', name: '设备A' },
  { id: 'device2', name: '设备B' },
  { id: 'device3', name: '设备C' },
]

const currentPage = computed(() => {
  const page = props.layoutConfig?.pages?.find((p) => p.id === route.query.page) || props.layoutConfig?.pages?.[0]
  if (page?.have_tabs) {
    return { ...page, tabs: mockTabs }
  }
  return page
})

console.log('currentPage', currentPage.value)

const updateTime = () => {
  const now = new Date()
  currentTime.value = now
    .toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/\//g, '-')
}

const handleTabClick = (tabId: string) => {
  currentTab.value = tabId
  if (currentPage.value?.fecth) {
    // 触发数据获取
  }
}

const closePageSelect = () => {
  showPageSelect.value = false
}

const handlePageChange = (pageId: string) => {
  console.log('handlePageChange', pageId)
  router.push({
    path: route.path,
    query: { ...route.query, page: pageId },
  })
  showPageSelect.value = false
}

// 使用 NodeJS.Timeout 替代 Timer
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left,
.header-right {
  flex: 1;
}

.header-center {
  flex: 1;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(to bottom, #fff, #7cb9ff);
  -webkit-background-clip: text;
  color: transparent;
}

.header-tabs {
  display: flex;
  gap: 20px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  color: var(--tab-color, #81a4f1);
  transition: background-color 0.2s;
}

.tab-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tab-item.active {
  background: rgba(255, 255, 255, 0.15);
}

.tab-item i {
  font-size: 16px;
}

.time-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: flex-end;
}

.time {
  font-size: 16px;
  color: #7cb9ff;
}

.icons {
  display: flex;
  gap: 10px;
}

.icon {
  width: 20px;
  height: 20px;
  color: #7cb9ff;
  cursor: pointer;
  transition: color 0.2s;
}

.icon:hover {
  color: #fff;
}

.title-select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.select-icon {
  color: #7cb9ff;
  width: 20px;
  height: 20px;
  transition: transform 0.2s;
}

.rotate-180 {
  transform: rotate(180deg);
}

.page-select-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(124, 185, 255, 0.3);
  border-radius: 4px;
  min-width: 200px;
  z-index: 1000;
}

.page-option {
  padding: 8px 16px;
  color: #7cb9ff;
  transition: background-color 0.2s;
}

.page-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.page-option.active {
  background: rgba(124, 185, 255, 0.2);
}
</style>
