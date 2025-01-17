<script setup lang="ts">
import { ref } from 'vue'
import { NStatistic, NNumberAnimation } from 'naive-ui'

const props = defineProps(['config', 'data'])

const demoData = ref<any>({
  avgTime: 100,
  maxTime: 200,
})
const demoConfig = ref({
  other: {
    unit: 'ms',
    items: [
      {
        name: '平均响应时间',
        key: 'avgTime',
      },
      {
        name: '最大响应时间',
        key: 'maxTime',
      },
    ],
  },
})
// 实际数据
const data = ref<any>(demoData.value)
const config = ref<any>(demoConfig.value)
// props 有值
if (props.data && props.config) {
  data.value = props.data
  config.value = props.config
}
</script>

<template>
  <div flex justify-center items-center flex-col>
    <template v-for="item in config.other.items">
      <n-statistic :label="item.name" tabular-nums mr-10>
        <n-number-animation :from="0" :to="(data && data[item.key as keyof typeof data]) || 0" :active="true" :precision="2" locale="en-US" show-separator />
        <template #suffix>{{ config.other.unit || '' }}</template>
      </n-statistic>
    </template>
  </div>
</template>

<style scoped>
:deep(.n-statistic .n-statistic__label) {
  text-align: end;
  color: #b1b2bb;
  font-size: 12px;
  margin-right: 10px;
}

:deep(.n-statistic .n-statistic-value) {
  text-align: end;
}

:deep(.n-statistic .n-statistic-value__content) {
  color: #00cae6;
  font-size: 22px;
  font-weight: 600;
  font-family: electronicFont;
}

:deep(.n-statistic .n-statistic-value__suffix) {
  color: #0586bd;
  font-size: small;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
