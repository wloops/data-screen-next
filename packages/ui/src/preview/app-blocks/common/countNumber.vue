<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { NNumberAnimation, NStatistic, NTooltip, NButton } from 'naive-ui'
import { Icon } from '@iconify/vue'
// import { EyeOff, Eye, RepeatOutline } from "@vicons/ionicons5";

interface CountNumber {
  total: number
  fail: number
}
const props = defineProps<{
  data: CountNumber
  config: any
}>()

const deviceCountNum = ref<CountNumber>({
  total: 0,
  fail: 0,
})
const others = ref<any>({})
const oldDeviceCountNum = ref<CountNumber>({
  total: 0,
  fail: 0,
})

console.log('数值统计props data config:', props.data, props.config)
deviceCountNum.value = props.data
others.value = props.config.other || {}
watch(
  () => ({ ...props.data }),
  (newValue, oldValue) => {
    console.log('newValue', newValue)
    console.log('oldValue', oldValue)
    deviceCountNum.value = newValue
    if (oldValue) {
      oldDeviceCountNum.value = oldValue
    }
    console.log('countNumber', newValue, oldValue)
  },
  {
    deep: true,
    immediate: true,
  }
)
// watch(props.data, (newVal, oldVal) => {
//   console.log('countNumber newVal', newVal, oldVal)
//   deviceCountNum.value = newVal
// }, {
//   deep: true,
//   immediate: true
// })
const percentMode = ref<boolean>(false)

function changePercent() {
  percentMode.value = !percentMode.value
}
// getSuccessText为计算属性
const getSuccessText = computed(() => {
  if (percentMode.value) {
    return calcPercent(deviceCountNum.value.total - deviceCountNum.value.fail) || 0
  } else {
    return deviceCountNum.value.total - deviceCountNum.value.fail || 0
  }
})
const getFailText = computed(() => {
  if (percentMode.value) {
    return calcPercent(deviceCountNum.value.fail)
  } else {
    return deviceCountNum.value.fail
  }
})
// 计算百分比
function calcPercent(num: number) {
  console.log('calcPercent', (num / deviceCountNum.value.total) * 100)
  return (num / deviceCountNum.value.total) * 100 || 0
}
</script>

<template>
  <div>
    <div class="container w-full h-full">
      <div pos-absolute top-0 right-0 z-2000>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button ghost size="medium" :bordered="false" text color="#799CE9" @click="percentMode = !percentMode" m-2>
              <template #icon>
                <!-- <n-icon>
                  <component :is="percentMode ? RepeatOutline : RepeatOutline" />
                </n-icon> -->
                <Icon icon="ic:round-repeat" />
              </template>
            </n-button>
          </template>
          <span> {{ percentMode ? '显示数值' : '显示占比' }} </span>
        </n-tooltip>
      </div>

      <div class="glass card-notbg" data-text="" :data-text-2="others && others.items ? others.items[0].name : '总数'" h-full pt-10 flex flex-col justify-center items-center>
        <div class="countBox w-full flex justify-center items-center flex-1">
          <n-statistic label="" tabular-nums>
            <n-number-animation
              ref="numAnimRefCount"
              :from="oldDeviceCountNum.total ? oldDeviceCountNum.total : 0"
              :to="deviceCountNum.total"
              :active="true"
              :precision="0"
              locale="en-US"
              show-separator
            />
            <template #suffix>{{ others && others.unit ? others.unit : '次' }}</template>
          </n-statistic>
        </div>
        <div class="areBox w-full flex justify-around items-center flex-1">
          <div class="onlineBox glass onoff card-notbg" :data-text-2="others && others.items ? others.items[1].name : '成功数'">
            <n-statistic label="" tabular-nums>
              <n-number-animation
                ref="numAnimRefOnline"
                :from="percentMode ? 0 : oldDeviceCountNum.total - oldDeviceCountNum.fail"
                :to="getSuccessText"
                :active="true"
                :precision="percentMode ? 5 : 0"
                locale="en-US"
                show-separator
              />
              <template #suffix>{{ percentMode ? '%' : others && others.unit ? others.unit : '次' }}</template>
            </n-statistic>
          </div>
          <div class="offlineBox glass onoff card-notbg" :data-text-2="others && others.items ? others.items[2].name : '失败数'">
            <n-statistic label="" tabular-nums @click="changePercent">
              <n-number-animation
                ref="numAnimRefOffline"
                :from="percentMode ? 0 : oldDeviceCountNum.fail"
                :to="getFailText"
                :active="true"
                :precision="percentMode ? 5 : 0"
                locale="en-US"
                show-separator
              />
              <template #suffix>{{ percentMode ? '%' : others && others.unit ? others.unit : '次' }}</template>
            </n-statistic>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* :deep(.n-statistic) {
  margin-top: 20px;
} */

:deep(.n-statistic .n-statistic__label) {
  text-align: end;
  color: #b1b2bb;
  font-size: 20px;
}

:deep(.n-statistic .n-statistic-value) {
  text-align: end;
}

:deep(.n-statistic .n-statistic-value__content) {
  color: #5486f3;
  font-size: 56px;
  font-weight: 600;
  font-family: electronicFont;
}

:deep(.n-statistic .n-statistic-value__suffix) {
  color: #0586bd;
  font-size: 14px;
  font-weight: 600;
}

:deep(.onoff .n-statistic .n-statistic-value__content) {
  font-size: 36px;
  color: #18a058;
}

:deep(.onoff:nth-child(2) .n-statistic .n-statistic-value__content) {
  color: #c27666;
}

.container .glass {
  position: relative;
  /* width: 95%;
  height: 27vh; */
  /* background: transparent; */
  /* border: 1px solid rgba(2, 24, 68, 0.1); */
  /* box-shadow: 0 25px 25px rgba(0, 0, 0, 0.15); */
  /* border: 2px dashed rgba(64, 121, 226, 0.35); */

  display: flex;
  justify-content: center;
  align-items: end;
  transition: 0.5s;
  border-radius: 10px;
  padding-bottom: 5px;
  margin: 10px;
  /* backdrop-filter: blur(10px); */
  transform: rotate(calc(var(--r) * 1deg));
}

.container .glass::after {
  content: attr(data-text-2);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  /* background: rgba(255, 255, 255, 0.05); */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  border-radius: 10px 10px 0 0;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  /* margin-top: -20px; */
}

.onlineBox,
.offlineBox {
  width: 50%;
  height: 90%;
}
</style>
