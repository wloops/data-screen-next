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
      <UDropdown :popper="{ placement: 'bottom' }" :items="pageItems" v-model="selectedPageId">
        <UButton variant="ghost" color="gray" class="title-select">
          <template #leading>
            <Icon :name="currentPage?.style?.icon || 'mdi:monitor'" class="title-icon" />
            <h1 class="title">{{ currentPage?.name || '监控页面' }}</h1>
          </template>
          <template #trailing>
            <Icon name="solar:double-alt-arrow-down-line-duotone" class="select-icon" />
          </template>
        </UButton>
      </UDropdown>
    </div>

    <!-- 右侧时间和操作 -->
    <div class="header-right">
      <div class="time-wrapper">
        <span class="time">{{ currentTime }}</span>
        <div class="icons">
          <Icon name="solar:refresh-square-broken" class="icon" />
          <Icon name="solar:maximize-square-minimalistic-outline" class="icon" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import type { Page, Tab, LayoutConfig } from '~/types/layout'

const props = defineProps<{
  layoutConfig: LayoutConfig
  currentPage?: Page
}>()

const emit = defineEmits<{
  'update:newPage': [Page | undefined]
}>()

const selectedPageId = ref('')
const currentTab = ref('')
const currentTime = ref('')

const pageItems = props.layoutConfig?.pages?.map((page) => [
  {
    label: page.name,
    icon: page?.style?.icon,
    // value: page.id,
    click: () => {
      console.log('click', page.id)
      handlePageChange(page.id)
    },
  },
])

const handlePageChange = (pageId: string) => {
  selectedPageId.value = pageId
  // 找到对应的页面数据
  const newPage = props.layoutConfig?.pages?.find((p) => p.id === pageId)
  emit('update:newPage', newPage)
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
  if (props.currentPage?.fecth) {
    // 触发数据获取
  }
}

// 在 currentPage computed 变化时也发射
// watch(props.currentPage, (newPage) => {
//   emit('update:currentPage', newPage)
// })

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
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(to bottom, #fff, #7cb9ff);
  background-clip: text;
  color: transparent;
}

.title-icon {
  width: 25px;
  height: 25px;
  margin-right: 1px;
  background: linear-gradient(to bottom, #fff, #7cb9ff);
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
  background: transparent;
  border: none;
}

.title-select:hover {
  background: rgba(255, 255, 255, 0.1);
}

.select-icon {
  color: #7cb9ff;
  width: 18px;
  height: 18px;
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
