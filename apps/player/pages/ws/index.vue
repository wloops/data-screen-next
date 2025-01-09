<template>
  <div>
    <h1>WebSocket 示例</h1>
    <p>连接状态: {{ status }}</p>
    <p>收到的消息: {{ data }}</p>
    <button @click="send(JSON.stringify(message))">发送</button>
    <button @click="send(JSON.stringify(message2))">发送2</button>
    <button @click="close(1000)">关闭连接</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWebSocket } from '@vueuse/core'

// 输入的消息
const message = ref({
  remark: '全局告警信息推送',
  init_ID: 'header_alarm_info',
  groupId: 'ALARM',
  itemId: 'SystemCurrentAlarmDetail',
})
const message2 = ref({
  groupId: 'BUSINESS',
  itemId: 'SystemAlarmDetail',
})

// 使用 useWebSocket
const { data, status, send, close } = useWebSocket('ws://work.paytunnel.cn:18800/websocket/channel', {
  autoReconnect: true, // 自动重连
  onMessage: (ws, event) => {
    console.log('收到消息:', JSON.parse(event.data))
  },
  onConnected: (ws) => {
    console.log('WebSocket 已连接')
  },
  onDisconnected: (ws, event) => {
    console.log('WebSocket 已断开')
  },
  onError: (ws, event) => {
    console.error('WebSocket 错误:', event)
  },
})
</script>

<style>
/* 简单的样式 */
div {
  font-family: Arial, sans-serif;
  padding: 20px;
}

input {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
}
</style>
