<template>
  <header class="dashboard-header" :style="layoutStyle">
    <!-- 左侧 tabs -->
    <div class="header-left">
      <div class="alarm">
        <div class="alarm-icon-wrapper">
          <UDropdown
            :items="alarm_data"
            mode="hover"
            :ui="{
              width: 'w-[450px]',
              item: {
                base: 'group flex items-center justify-between w-full',
                padding: 'px-3 py-2',
              },
            }"
          >
            <!-- <Icon name="solar:lightbulb-minimalistic-bold-duotone" class="alarm-icon" /> -->
            <div class="loader">
              <svg t="1719556494873" class="icon" viewBox="0 0 1109 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1506" width="25" height="25">
                <path
                  d="M586.709333 810.666667h-319.573333v-226.133334C267.178667 379.221333 390.4 256 554.666667 256c159.744 0 280.704 116.522667 287.189333 311.893333h-176.981333c-52.096 0-78.165333 26.026667-78.165334 78.122667V810.666667z"
                  opacity=".4"
                  p-id="1507"
                  :fill="getAlarmClass(currentAlarm.level, true)"
                ></path>
                <path
                  d="M952.490667 621.653333h-240.938667c-40.106667 0-60.202667 20.053333-60.202667 60.245334v301.141333l60.202667-60.245333h240.938667c40.106667 0 60.202667-20.053333 60.202666-60.202667v-180.693333c0-40.149333-20.053333-60.245333-60.202666-60.245334z m-200.362667 170.666667a20.181333 20.181333 0 0 1-20.181333-20.053333c0-11.093333 8.874667-20.096 19.968-20.096h0.213333a20.053333 20.053333 0 1 1 0 40.106666z m80.298667 0a20.181333 20.181333 0 0 1-20.181334-20.053333c0-11.093333 8.917333-20.096 19.968-20.096h0.213334a20.053333 20.053333 0 1 1 0 40.106666z m80.298666 0a20.181333 20.181333 0 0 1-20.181333-20.053333c0-11.093333 8.917333-20.096 19.968-20.096h0.213333a20.053333 20.053333 0 1 1 0 40.106666z"
                  p-id="1508"
                  :fill="getAlarmClass(currentAlarm.level, true)"
                ></path>
                <path d="M586.709333 810.666667v128H213.333333v-64A64 64 0 0 1 277.333333 810.666667h309.376z" p-id="1509" :fill="getAlarmClass(currentAlarm.level, true)"></path>
                <path
                  d="M414.890667 562.986667c-0.853333 0-1.664 0-2.56-0.085334a32 32 0 0 1-29.397334-34.389333c6.912-88.96 82.346667-158.634667 171.776-158.634667a32 32 0 0 1 0 64 107.306667 107.306667 0 0 0-107.946666 99.584 32.085333 32.085333 0 0 1-31.872 29.525334zM554.666667 181.333333a32 32 0 0 1-32-32V85.333333a32 32 0 0 1 64 0v64a32 32 0 0 1-32 32zM832 266.666667a32 32 0 0 1-22.613333-54.656l64-64a32 32 0 1 1 45.226666 45.269333l-64 64a31.914667 31.914667 0 0 1-22.613333 9.386667zM277.333333 266.666667a31.744 31.744 0 0 1-22.613333-9.386667l-64-64a32 32 0 1 1 45.226667-45.269333l64 64A32 32 0 0 1 277.333333 266.666667z"
                  p-id="1510"
                  :fill="getAlarmClass(currentAlarm.level, true)"
                ></path>
              </svg>
              <div :class="{ point: currentAlarm.level == 1, point2: currentAlarm.level == 2 }"></div>
            </div>
            <template #item="{ item }">
              <div class="flex items-center gap-2 flex-1">
                <UIcon :name="item.icon" class="w-6 h-6" />
                <span class="truncate">{{ item.label }}</span>
              </div>
              <span class="text-sm text-gray-500 shrink-0">{{ item.time }}</span>
            </template>
          </UDropdown>
          <span :class="[getAlarmClass(currentAlarm.level), 'alarm-text']" v-if="!currentPage?.have_tabs">{{ currentAlarm.title }}</span>
        </div>
      </div>
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
import { useWebSocket, useDateFormat } from '@vueuse/core'
import type { Page, Tab, LayoutConfig } from '~/types/layout'
import { useArrayStructure } from './hooks/useArrayStructure'

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

const bg_default_url = '/assets/background/'
const layoutStyle = computed(() => ({
  background: props.layoutConfig?.layout?.header?.background?.image ? `url(${bg_default_url}${props.layoutConfig.layout.header.background.image}) no-repeat` : 'none',
  backgroundSize: '100% 100%',
}))

// websocker base_url
const base_url = props.layoutConfig?.fecth?.base_url?.ws
const main_send = props.layoutConfig?.fecth?.send

// 告警数据
const levelMap: any = {
  0: {
    label: '提示',
    fontCorlor: '#0E6DB6',
  },
  1: {
    label: '警告',
    fontCorlor: '#E69C68',
  },
  2: {
    label: '异常',
    fontCorlor: '#D85C6D',
  },
}
const alarm_data = ref<any[]>([])
const currentAlarm = ref<{ title: string; level: number }>({ title: '', level: 0 })
if (base_url && main_send && main_send.length > 0) {
  main_send.forEach((item: any) => {
    console.log('item', item)
    if (item.mode === 'ws' && item.in === 'header') {
      const { data, status, send, close } = useWebSocket(base_url, {
        autoReconnect: true,
        onMessage: (ws, event) => {
          const message = JSON.parse(event.data)
          console.log('header收到消息:', message)
          const data = useArrayStructure(message.data)
          alarm_data.value = setAlarmList(data)
          currentAlarm.value = { title: alarm_data.value[0][0].alarmName, level: alarm_data.value[0][0].level }
          console.log('alarm_data', alarm_data.value)
        },
      })
      send(JSON.stringify(item.params))
    }
  })
}

// 创建一个格式化函数
const formatDate = (dateStr: string) => {
  return useDateFormat(dateStr, 'YYYY-MM-DD HH:mm:ss').value
}

const setAlarmList = (data: any[]) => {
  const alarmList = data.map((item) => ({
    label: `${item.alarmName}-${item.key}`,
    alarmName: item.alarmName,
    time: formatDate(`${item.inputDate} ${item.inputTime}`), // 使用formatDate函数
    icon: item.alarmLevel === 2 ? 'mynaui:danger-circle-solid' : 'mynaui:danger-triangle-solid',
    class: getAlarmClass(item.alarmLevel),
    level: item.alarmLevel,
  }))
  alarmList.sort((a, b) => a.level - b.level)
  return [alarmList]
}

const getAlarmClass = (level: number, returnColor: boolean = false) => {
  switch (level) {
    case 1:
      return !returnColor ? 'alarm-critical' : '#ef4444'
    case 2:
      return !returnColor ? 'alarm-warning' : '#eab308'
    default:
      return !returnColor ? 'alarm-info' : '##3b82f6'
  }
}

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
  font-size: 20px;
  color: #7cb9ff;
  font-family: electronicFont;
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

.alarm-icon {
  width: 24px;
  height: 24px;
  color: #7cb9ff;
}

:deep(.alarm-critical) {
  @apply text-red-500;
}

:deep(.alarm-warning) {
  @apply text-yellow-500;
}

:deep(.alarm-info) {
  @apply text-blue-500;
}

.loader {
  width: fit-content;
  height: fit-content;
  border-radius: 7px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: 0.2s;
}

.loader:hover svg {
  color: white;
}

.loader svg {
  color: rgba(255, 255, 255, 0.651);
  transform: scale(1.2);
  transition: 0.2s;
}

.point,
.point2 {
  position: absolute;
  top: 50%;
  width: 0px;
  height: 0px;
  background-color: rgb(230, 156, 104);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.point::before {
  content: '';
  position: absolute;
  width: 0px;
  height: 0px;
  background-color: rgb(230, 156, 104);
  border-radius: 25px;
  animation: loop 1s 0s infinite;
}

.point2::before {
  content: '';
  position: absolute;
  width: 0px;
  height: 0px;
  background-color: rgb(216, 92, 109);
  border-radius: 25px;
  animation: loop2 1s 0s infinite;
}

@keyframes loop {
  0% {
    background-color: rgb(230, 156, 104);
    width: 1px;
    height: 1px;
  }

  100% {
    background-color: rgba(230, 156, 104, 0);
    width: 50px;
    height: 50px;
  }
}

@keyframes loop2 {
  0% {
    background-color: rgb(216, 92, 109);
    width: 1px;
    height: 1px;
  }

  100% {
    background-color: rgba(216, 92, 109, 0);
    width: 50px;
    height: 50px;
  }
}

.alarm-text {
  font-size: 14px;
  line-height: 21px;
}
</style>
