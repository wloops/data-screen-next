<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useThemeVars, NButton, NTag, NDescriptions, NDescriptionsItem, NProgress, NScrollbar, NTime } from 'naive-ui'
const themeVars = useThemeVars()

const props = defineProps(['config', 'data'])

const descData = ref<any>([
  {
    key: 'id',
    label: '平台标识',
    value: '',
  },
  {
    key: 'ip',
    label: 'IP地址',
    value: '',
  },
  {
    key: 'port',
    label: '端口',
    value: '',
  },
  {
    key: 'version',
    label: '版本',
    value: '',
  },
  {
    key: 'licenseCode',
    label: '项目产品授权码',
    value: '',
  },
  {
    key: 'prdSerialNum',
    label: '产品序列号',
    value: '',
  },
  {
    key: 'effectiveDate',
    label: '序列号截止有效日期',
    value: '',
    type: 'date',
  },
  {
    key: 'maintainingDate',
    label: '维护截止有效日期',
    value: '',
    type: 'date',
  },
  {
    key: 'startup',
    label: '平台启动时间',
    value: '',
    type: 'dateTime',
  },
  {
    key: 'srvUsability',
    label: '平台状态',
    value: '',
    type: 'status',
  },
  {
    key: 'cpu',
    label: 'CPU使用率',
    value: 0,
    type: 'progress',
    span: 1,
  },
  {
    key: 'mem',
    label: '内存使用率',
    value: 0,
    type: 'progress',
  },
  {
    key: 'disk',
    label: '磁盘使用率',
    value: 0,
    type: 'progress',
  },
  {
    key: 'tota1Disk',
    label: '磁盘总容量',
    value: 0,
    type: 'notShow',
  },
  {
    key: 'usedDisk',
    label: '磁盘已用容量',
    value: 0,
    type: 'notShow',
  },
  {
    key: 'totalMem',
    label: '内存总容量',
    value: 0,
    type: 'notShow',
  },
  {
    key: 'usedMem',
    label: '内存已用容量',
    value: 0,
    type: 'notShow',
  },
])

console.log('infos:data>', props.data, props.config)

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

watch(
  () => props.data,
  (newVal, oldVal) => {
    if (newVal) {
      console.log('infos:newVal>', newVal)
      // 替换descData中的值
      for (const key in newVal) {
        if (Object.prototype.hasOwnProperty.call(newVal, key)) {
          const element = newVal[key]
          for (const item of descData.value) {
            if (item.key === key) {
              item.value = element || ''
            }
          }
        }
      }
    }
  },
  {
    immediate: true,
  }
)

const descColumn = ref(1)
const setSpan = (item: any) => {
  const maxSpanList = ['cpu', 'ram']
  if (maxSpanList.includes(item.key)) {
    return descColumn.value
  }
  return 1
}

const progressColor = (percent: number) => {
  if (percent <= 50) {
    return themeVars.value.successColor
  } else if (percent > 50 && percent < 80) {
    return themeVars.value.warningColor
  } else {
    return themeVars.value.errorColor
  }
}

// 处理格式(容量转换)
const formatSize = (size: number, isUnit: boolean = false) => {
  // 最小单位为kb
  size = size * 1024
  if (size < 1024) {
    return size.toFixed(2) + (isUnit ? ' B' : '')
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + (isUnit ? ' KB' : '')
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + (isUnit ? ' MB' : '')
  } else if (size < 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + (isUnit ? ' GB' : '')
  } else {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + (isUnit ? ' TB' : '')
  }
}

const getSize = (key: string, percent: number) => {
  let used = 0
  let total = 0
  if (key === 'disk') {
    used = props.data?.usedDisk || 0
    total = props.data?.totalDisk || 0
  } else if (key === 'mem') {
    used = props.data?.usedMem || 0
    total = props.data?.totalMem || 0
  }
  console.log('used:', formatSize(used), 'total:', total, 'percent:', percent)
  return `${formatSize(used)} / ${formatSize(total, true)} (${percent.toFixed(2)}%)`
}

// 定义一个函数来计算时间差（毫秒）
function getTimeDifferenceInMilliseconds(dateString: string) {
  const targetDate = dayjs(dateString)
  const now = dayjs()
  return now.diff(targetDate) // 返回毫秒差
}
</script>

<template>
  <div flex flex-col justify-between>
    <div>
      <n-scrollbar trigger="none" :style="{ maxHeight: props.config?.height ? props.config.height + 'px' : '400px' }">
        <n-descriptions label-placement="left" bordered title="" :column="descColumn" size="small">
          <template v-for="(item, index) in descData" :key="index">
            <n-descriptions-item v-if="item.type !== 'notShow'" :label-style="{ color: '#818991', fontSize: '13px' }" :span="setSpan(item)">
              <template #label>
                {{ item.label }}
              </template>
              <div v-if="item.type === 'progress'">
                <n-progress :percentage="Number(item.value.toFixed(2))" indicator-placement="inside" type="line" :height="16" indicator-text-color="#fff" :color="progressColor(item.value.toFixed(2))">
                  <span>{{ item.key === 'mem' || item.key === 'disk' ? getSize(item.key, item.value) : item.value.toFixed(2) + '%' }}</span>
                </n-progress>
              </div>
              <span v-else-if="item.type === 'date' && item.value">{{ formatDate(item.value) }}</span>
              <span v-else-if="item.type === 'status'">
                <n-tag :bordered="false" :type="item.value === 1 ? 'success' : 'error'" size="small">
                  {{ item.value === 1 ? '正常' : '异常' }}
                </n-tag>
              </span>
              <span v-else-if="item.key === 'startup'" flex items-center>
                {{ item.value }}
                <n-tag :bordered="true" size="small" ml-5 type="info">
                  <n-time v-if="item.value" :time="0" :to="getTimeDifferenceInMilliseconds(item.value)" type="relative" />
                </n-tag>
              </span>
              <span v-else style="font-size: 13px">{{ item.value }}</span>
            </n-descriptions-item>
          </template>
        </n-descriptions>
      </n-scrollbar>
    </div>
    <!-- <div overflow-hidden flex justify-center items-center>
      <n-scrollbar trigger="none" x-scrollable :style="{ width: data.width, maxHeight: '100%' }">
        <div class="custom-infos-status" h-150 flex justify-center items-center>
          <div class="custom-infos-status-item" v-for="(item, index) in 10" :key="index" mr-20 flex justify-center
            items-center flex-col>
            <CustomIcon icon="server" color="red" :size="80" type="custom"></CustomIcon>
            <div class="custom-infos-status-item-text">XX服务</div>
          </div>
        </div>
      </n-scrollbar>
    </div> -->
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
