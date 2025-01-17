<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// 状态映射表
const statusMap = {
  online: '在线',
  offline: '离线',
  warning: '警告'
}
</script>

<template>
  <div class="node-info" :class="data.status">
    <div class="node-header">
      <div class="node-title">
        <span class="node-name" :data-tooltip="props.data.nodeName">
          {{ props.data.nodeName }}
        </span>
        <span class="node-type" :data-tooltip="props.data.type">
          {{ props.data.type }}
        </span>
      </div>
      <span :class="['status-dot', data.status]"></span>
    </div>
    <div class="info-row">
      <div class="address">
        <span class="value" :data-tooltip="`${props.data.ip}:${props.data.port}`">
          {{ props.data.ip }}:{{ props.data.port }}
        </span>
      </div>
      <div class="status-text" :class="data.status">
        {{ statusMap[data.status] }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 4px; */
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0);
}

.node-name {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  min-width: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  margin-left: 8px;
}

.status-dot::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  opacity: 0.5;
}

.status-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.status-dot.online {
  background: #67C23A;
  box-shadow: 0 0 6px #67C23A;
}

.status-dot.online::before {
  background: rgba(103, 194, 58, 0.3);
}

.status-dot.online::after {
  background: rgba(103, 194, 58, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.status-dot.offline {
  background: #f60707;
  box-shadow: 0 0 8px #f61212;
}

.status-dot.offline::before {
  background: rgba(245, 108, 108, 0.4);
  animation: glow 2s ease-in-out infinite;
}

.status-dot.offline::after {
  background: rgba(245, 108, 108, 0.4);
  animation: pulse 2s ease-in-out infinite alternate;
}

.status-dot.warning {
  background: #E6A23C;
  box-shadow: 0 0 8px #E6A23C;
}

.status-dot.warning::before {
  background: rgba(230, 162, 60, 0.4);
  animation: glow 2s ease-in-out infinite;
}

.status-dot.warning::after {
  background: rgba(230, 162, 60, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }

  50% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
}

@keyframes glow {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.5);
  }

  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  line-height: 1.3;
  padding: 0;
  /* height: 24px; */
}

.address {
  display: flex;
  align-items: center;
}

.value {
  font-family: monospace;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.status-text {
  font-size: 12px;
  padding: 2px 0px;
  border-radius: 8px;
  min-width: 42px;
  text-align: center;
  line-height: 1.5;
  flex-shrink: 0;
  margin-left: 8px;
}

.status-text.online {
  color: #67C23A;
  background: rgba(103, 194, 58, 0.2);
}

.status-text.offline {
  color: #f60707;
  background: rgba(246, 7, 7, 0.2);
}

.status-text.warning {
  color: #E6A23C;
  background: rgba(230, 162, 60, 0.2);
}

.node-info.online {
  background: rgba(103, 194, 58, 0.18);
  border-color: rgba(103, 194, 58, 0.4);
}

.node-info.offline {
  background: rgba(246, 7, 7, 0.4);
  border-color: rgba(246, 7, 7, 0.5);
}

.node-info.warning {
  background: rgba(230, 162, 60, 0.4);
  border-color: rgba(230, 162, 60, 0.5);
}

.node-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.node-type {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  padding: 1px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
  flex-shrink: 0;
}

.node-ip {
  font-size: 14px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

[data-tooltip] {
  position: relative;
  cursor: pointer;
}

[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}
</style>
