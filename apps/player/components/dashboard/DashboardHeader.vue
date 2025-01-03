<template>
  <header class="dashboard-header">
    <div class="header-left">
      <div class="logo">
        <div class="logo-icon">🏢</div>
        <span>服务不可用-SJI1310-HSM-01</span>
      </div>
    </div>
    <div class="header-center">
      <h1 class="title">业务运行态势</h1>
    </div>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

const currentTime = ref('')
const timer = ref<ReturnType<typeof setInterval>>()

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

onMounted(() => {
  updateTime()
  timer.value = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = undefined
  }
})
</script>

<style scoped>
.dashboard-header {
  height: 60px;
  padding: 0 20px;
  background: rgba(0, 24, 71, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  border-bottom: 2px solid rgba(0, 124, 255, 0.3);
}

.header-left {
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  position: relative;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.time-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
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
</style>
