<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Page, LayoutConfig } from '../../types/layout'

const props = defineProps<{
  currentPage?: Page
  layoutConfig: LayoutConfig
  fetch: any
}>()

const currentTime = ref('')
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

<template>
  <div>
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
  </div>
</template>

<style scoped>
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
</style>
