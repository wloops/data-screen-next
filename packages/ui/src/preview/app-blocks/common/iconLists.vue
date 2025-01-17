<script setup lang="ts">
const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div pl-5 pr-5 flex flex-col justify-between>
    <div overflow-hidden flex justify-center items-center>
      <n-scrollbar trigger="none" x-scrollable :style="{ width: config.width + 'px', maxHeight: '100%' }">
        <div class="custom-infos-status" h-150 flex justify-center items-center>
          <div class="custom-infos-status-item" v-for="(item, index) in 10" :key="index" mr-20 flex justify-center items-center flex-col>
            <CustomIcon icon="server" color="red" :size="80" type="custom"></CustomIcon>
            <div flex justify-between items-center>
              <n-badge color="" dot />
              <div class="custom-infos-status-item-text" ml-5>XX服务</div>
            </div>
          </div>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-descriptions-table-wrapper) {
  background-color: transparent !important;
  border: 0 !important;
}

:deep(.n-descriptions-table-header) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 0 !important;
}

:deep(.n-descriptions-table-content) {
  border: 0 !important;
}
</style>
