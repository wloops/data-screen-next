<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useThemeVars } from 'naive-ui'
import dayjs from 'dayjs'
import { useCommonChart } from '../../../hooks/useCommonChart'
// import { useProceResponseData } from '@/hooks/useProceResponseData'
const { getOption, init } = useCommonChart()
const props = defineProps(['config', 'data'])

onMounted(() => {
  initChart()
})

watch(
  () => props.data,
  () => {
    initChart()
  }
)

let confirm_data = ref([
  {
    deviceId: 1,
    name: '',
    ip: '',
    port: '0',
    startup: '',
    cpu: 0,
    mem: 0,
    // diskUsage: '80%',
    disk: 0,
    chartData: {
      label: '设备风险值',
      value: 0,
    },
  },
])
// let confirm_data = ref([
//   {
//     deviceId: 1,
//     name: '电子签章服务器0086',
//     ip: '192.168.1.0.1',
//     port: '80',
//     startup: '132.5个小时',
//     cpu: 28,
//     mem: 56,
//     // diskUsage: '80%',
//     disk: 86,
//     chartData: {
//       label: '设备风险值',
//       value: 96,
//     },
//   },

// ])

console.log('confirm_data:', props.data)

watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      confirm_data.value = newVal.data
    }
  }
)

const themeVars = useThemeVars()

const progressColor = (percent: number) => {
  if (percent < 50) {
    return themeVars.value.successColor
  } else if (percent > 50 && percent < 80) {
    return themeVars.value.warningColor
  } else {
    return themeVars.value.errorColor
  }
}

const initChart = () => {
  let resultData = null
  // if (!Array.isArray(confirm_data.value)) {
  resultData = props.data.data
  // }
  if (resultData) {
    resultData.forEach((data: any, index: number) => {
      // console.log('dom %:', dom, props.data)
      // if (props.config.request && props.data.length > 0) {
      //   resultData = useProceResponseData(props.config.request?.params.wsId, props.data)
      // }
      nextTick(() => {
        const domId = 'child-left-' + resultData[index].deviceId
        const dom = document.getElementById(domId)
        console.log('resultData data:', dom, resultData)
        if (!dom) return
        const type = 'gauge'
        init(dom, type, 'default-gauge-1', resultData[index].chartData)
      })
    })
  }
}

function timeFromNow(time: string) {
  if (!time) return '离线'
  const pastTime = dayjs(time)
  const now = dayjs()
  const diffInSeconds = now.diff(pastTime, 'second')
  const diffInMinutes = now.diff(pastTime, 'minute')
  const diffInHours = now.diff(pastTime, 'hour')
  const diffInDays = now.diff(pastTime, 'day')
  const diffInMonths = now.diff(pastTime, 'month')
  const diffInYears = now.diff(pastTime, 'year')

  if (diffInYears > 0) {
    return `${diffInYears}年`
  } else if (diffInMonths > 0) {
    return `${diffInMonths}个月`
  } else if (diffInDays > 0) {
    return `${diffInDays}天`
  } else if (diffInHours > 0) {
    return `${diffInHours}小时`
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}分钟`
  } else {
    return `${diffInSeconds}秒`
  }
}
</script>

<template>
  <div w-full h-full flex justify-center flex-col>
    <div class="derviceBox1 flex-1" v-for="(data, index) in props.data.data" :key="data.id">
      <div class="chart" :id="'child-left-' + data.deviceId" style="width: 50%; height: 100%; margin-right: 5%" ref="derviceChart"></div>
      <div class="dervice-info-box">
        <div class="dervice-info-title">
          <span>{{ data.deviceId }}</span>
          <n-tag :bordered="false" :type="data.srvUsability === 1 ? 'success' : 'error'" size="small" style="margin-left: 10px">
            {{ data.srvUsability === 1 ? '正常' : '异常' }}
          </n-tag>
        </div>
        <div class="dervice-info-content">
          <div class="dervice-info-item">
            <div class="dervice-info-item-title">IP地址：</div>
            <div class="dervice-info-item-content">{{ data.ip }}</div>
          </div>
          <div class="dervice-info-item">
            <div class="dervice-info-item-title">端口：</div>
            <div class="dervice-info-item-content">{{ data.port }}</div>
          </div>
          <div class="dervice-info-item" v-if="data.startup">
            <div class="dervice-info-item-title">运行时长：</div>
            <div class="dervice-info-item-content">{{ timeFromNow(data.startup) }}</div>
          </div>
          <div class="dervice-info-item">
            <div class="dervice-info-item-title">CPU利用率：</div>
            <div class="dervice-info-item-content">
              <n-progress type="line" :color="progressColor(Number(data.cpu))" :percentage="Number(data.cpu)" indicator-text-color="#ffffffc7" processing>
                {{ data.cpu ? data.cpu + '%' : '0%' }}
              </n-progress>
            </div>
          </div>
          <div class="dervice-info-item">
            <div class="dervice-info-item-title">内存利用率：</div>
            <div class="dervice-info-item-content">
              <n-progress type="line" :color="progressColor(Number(data.mem))" :percentage="Number(data.mem)" indicator-text-color="#ffffffc7" processing>
                {{ data.mem ? data.mem + '%' : '0%' }}
              </n-progress>
            </div>
          </div>
          <div class="dervice-info-item" v-if="data.disk">
            <div class="dervice-info-item-title">磁盘利用率：</div>
            <div class="dervice-info-item-content">
              <n-progress type="line" :color="progressColor(Number(data.disk))" :percentage="Number(data.disk)" indicator-text-color="#ffffffc7" processing>
                {{ data.disk ? data.disk + '%' : '0%' }}
              </n-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.derviceBox1 {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .chart {
    flex: 1;
    /* width: 50%; */
    height: 100%;
    /* margin-right: 10%; */
  }

  .dervice-info-box {
    flex: 1;
    /* width: 50%; */
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: #ffffffc7;
    margin-top: 25px;
    margin-right: 20px;

    .dervice-info-title {
      color: #04b7e4;
      font-weight: 600;
      width: 100%;
      text-align: left;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .dervice-info-content {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 12px;
      margin-top: 10px;

      .dervice-info-item {
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;

        .dervice-info-item-title {
          font-size: 12px;
          font-weight: 500;
          color: #869ba0;
          margin-right: 10px;
          text-align: left;
        }

        .dervice-info-item-content {
          flex: 2;
          font-size: 12.5px;
          font-weight: 500;
          color: #ffffffc7;
          /* text-align: right; */
        }
      }
    }
  }
}
</style>
