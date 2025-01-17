<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useThemeVars } from 'naive-ui'

const props = defineProps(['config', 'data'])
const data = ref<any[]>([])
// const data = ref([
//   {
//     name: 'CPU',
//     number: 80,
//     percent: 80
//   },
//   {
//     name: 'Memory',
//     number: 60,
//     percent: 60
//   },
//   {
//     name: 'Disk',
//     number: 70,
//     percent: 70
//   },
//   {
//     name: 'Network',
//     number: 90,
//     percent: 90
//   },
//   {
//     name: 'Temperature',
//     number: 60,
//     percent: 60
//   }
// ])

console.log('LoadTop.vue props: ', props.data, props.config)

const config = ref<any>({
  unit: '%',
})

const formatData = (data: any, key: string) => {
  const r_data: any[] = []
  data.forEach((item: any) => {
    r_data.push({
      name: item.deviceId,
      number: Number(item[key]),
      percent: Number(item[key]),
    })
  })
  console.log('LoadTop.vue formatData: ', r_data)
  return r_data
}

watch(
  () => props.data,
  (val) => {
    if (val && props.config.other) {
      if (props.config.other.unit === '%') {
        data.value = formatData(val.data, props.config.other.key)
      } else {
        data.value = val.data
      }
    }
  },
  {
    immediate: true,
  }
)

watch(
  () => props.config,
  (val) => {
    if (val && val.other) {
      config.value = val.other
    }
  },
  {
    immediate: true,
  }
)

const themeVars = useThemeVars()

const getSortedData = (data: any) => {
  if (!Array.isArray(data)) return data
  return data.sort((a: any, b: any) => Number(b.percent) - Number(a.percent))
}

function getLongestTextWidth(arr: any, key: string, font = '16px Arial') {
  // 创建一个隐藏的 span 元素
  const span = document.createElement('span')
  document.body.appendChild(span) // 先将元素添加到页面

  // 设置样式
  span.style.font = font
  span.style.visibility = 'hidden'
  span.style.whiteSpace = 'nowrap' // 禁止换行，确保计算的是一行的宽度

  // 遍历数组，找出指定 key 对应值最长的宽度
  let maxWidth = 0
  arr.forEach((item: any) => {
    const text = item[key] // 获取对应属性的值
    span.innerText = text // 设置 span 的文本内容
    const width = span.offsetWidth // 获取该文本的宽度
    if (width > maxWidth) {
      maxWidth = width // 更新最大宽度
    }
  })

  // 移除 span 元素
  document.body.removeChild(span)

  return maxWidth + 'px'
}

const maxWidth = ref('100px')
onMounted(() => {
  maxWidth.value = getLongestTextWidth(data.value, 'name') !== '0px' ? getLongestTextWidth(data.value, 'name') : '100px'
  console.log('LoadTop.vue maxWidth: ', maxWidth.value)
})

const progressColor = (percent: number) => {
  if (config.value.colorful && config.value.colorful === false) {
    return themeVars.value.infoColor
  }
  if (percent <= 50) {
    return themeVars.value.successColor
  } else if (percent > 50 && percent < 80) {
    return themeVars.value.warningColor
  } else {
    return themeVars.value.errorColor
  }
}

let progressTextWidth = ref('100px')
const getProgressText = (item: any) => {
  let text = ''
  if (config.value.unit === '%') {
    text = `${item.percent}%`
  } else {
    text = `${item.number}${config.value.unit}`
  }
  progressTextWidth.value = getLongestTextWidth(data.value, 'percent')
  return text
}
</script>

<template>
  <div w-full h-full flex justify-center items-center>
    <div class="loadBox" w-full h-full c-coolgray-300 p-20>
      <div class="load-info-box" h-full flex flex-col justify-center items-center>
        <div class="load-info-item" flex-1 w-full v-for="item in getSortedData(data)" :key="item.name">
          <div flex justify-between items-center>
            <div class="load-info-item-title text-14 mr-15" :style="{ width: maxWidth }">
              {{ item.name }}
            </div>
            <div class="load-info-item-content flex justify-between items-center" :style="{ width: `calc(100% - ${maxWidth})` }">
              <div class="progress-box mr-10">
                <n-progress type="line" :color="progressColor(item.percent)" :percentage="Number(item.percent)" indicator-text-color="#ffffffc7" :show-indicator="false" :height="12"></n-progress>
              </div>
              <div flex justify-end items-center :style="{ width: progressTextWidth }">
                <span text-13 w-full :style="{ color: progressColor(item.percent) }">
                  {{ getProgressText(item) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-box {
  width: 100%;
  margin-right: 20px;
}
</style>
