<script setup lang="ts">
import { useWebSocket, useDateFormat } from '@vueuse/core'
import { useArrayStructure } from '../hooks/useArrayStructure'

import type { Page, LayoutConfig } from '~/types/layout'

const props = defineProps<{
  layoutConfig: LayoutConfig
  currentPage?: Page
  fetch: any
}>()

const currentTab = ref('')
const alarm_data = ref<any[]>([])
const currentAlarm = ref<{ title: string; level: number }>({ title: '', level: 0 })

const base_url = props.layoutConfig?.fecth?.base_url?.ws
console.log('base_url', base_url)

if (props.fetch && props.fetch.length > 0) {
  props.fetch.forEach((item: any) => {
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
  })
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

// 创建一个格式化函数
const formatDate = (dateStr: string) => {
  return useDateFormat(dateStr, 'YYYY-MM-DD HH:mm:ss').value
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
</script>

<template>
  <div>
    <!-- 左侧 tabs -->
    <div class="flex items-center justify-between">
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
        <div v-for="tab in currentPage.tabs" :key="tab.id" :class="['tab-item', { active: currentTab === tab.id }]">
          <span>{{ tab.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alarm {
  margin-left: 10px;
  margin-right: 20px;
  .alarm-icon-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
  }
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
  line-height: 20px;
}
</style>
