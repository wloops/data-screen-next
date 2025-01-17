<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import StatusCard from './statusCard.vue'
import ChartCard from './chart.vue'
// import { GitBranchSharp, FileTrayFull } from '@vicons/ionicons5'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      boxType: 'status',
      columns: 6,
      minWidth: 240,
      minHeight: 160,
      gap: 6,
      cardConfig: {},
    }),
  },
  data: {
    type: Array,
    default: () => [],
  },
})

// 提取公共配置
const getConfig = () => ({
  cardWidth: props.config.minWidth || 240,
  cardHeight: props.config.minHeight || 180,
  gap: props.config.gap || 6,
})

// 响应式变量
const boxsWrapper = ref(null)
const columns = ref(6)
const displayData = ref([])
const groupedData = ref({})
const scale = ref(1)

// 添加背景图标映射
const bgIconMap = {
  node: GitBranchSharp,
  cipherMachine: FileTrayFull,
}

// 更新布局和缩放
const updateLayout = () => {
  if (!boxsWrapper.value) return

  const { cardWidth, gap } = getConfig()
  const containerWidth = boxsWrapper.value.offsetWidth
  const containerHeight = boxsWrapper.value.offsetHeight

  // 计算每行最多能放几个卡片
  const maxColumns = Math.floor((containerWidth + gap) / (cardWidth + gap))
  const newColumns = Math.max(1, Math.min(maxColumns, props.config.columns || 6))

  // 获取总项目数
  const totalItems = displayData.value.length

  // 计算实际需要的行数
  const rows = Math.ceil(totalItems / newColumns)

  // 计算实际需要的空间
  const itemHeight = props.config.boxType === 'status' ? 80 : props.config.minHeight
  // 考虑间隙的影响
  const totalWidth = newColumns * cardWidth + (newColumns - 1) * gap
  const totalHeight = rows * itemHeight + (rows - 1) * gap

  // 计算缩放比例
  const scaleX = containerWidth / totalWidth
  const scaleY = containerHeight / totalHeight
  const newScale = Math.min(scaleX, scaleY, 1)

  // 更新状态
  scale.value = newScale
  columns.value = newColumns
}

// 更新显示数据
const updateDisplayData = () => {
  // 确保 props.data 是数组
  let _displayData = generateMockData(props.config.boxType)
  // let _displayData = props.data?.data || generateMockData(props.config.boxType)
  console.log('updateDisplayData:_displayData', _displayData)

  // 更新分组数据
  if (props.config.boxType === 'status') {
    const groups = {}
    if (Array.isArray(_displayData)) {
      _displayData.forEach((item) => {
        if (!groups[item.region]) {
          groups[item.region] = []
        }
        groups[item.region].push(item)
      })
    }
    groupedData.value = groups
  }

  displayData.value = _displayData
  console.log('updateDisplayData', groupedData.value)
}

// 监听容器尺寸变化
let resizeObserver
onMounted(() => {
  console.log('onMounted', props.data)

  updateDisplayData()
  if (boxsWrapper.value) {
    updateLayout()
    resizeObserver = new ResizeObserver(() => {
      updateLayout()
    })
    resizeObserver.observe(boxsWrapper.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

// 生成模拟数据
const generateMockData = (type) => {
  if (type === 'status') {
    const mockData = {
      DEVICE: [
        {
          achvnodes: '',
          contactor: 'jkAdmin',
          id: 'SJJ1310-HSM-01',
          ip: '172.17.3.25',
          name: 'SJJ1310密码机01',
          partition: 'A区',
          port: 8018,
          status: 1,
          type: '21',
          typeName: 'SJJ1310密码机',
          vendor: '江南天安',
        },
      ],
      TSSC: [
        {
          achvnodes: 'SJJ1310-HSM-01,SJJ1310-HSM-02,',
          contactor: 'jkAdmin',
          id: 'NODE01',
          ip: '172.17.3.26',
          name: '密码服务平台节点01',
          partition: 'A区',
          port: 49801,
          status: 1,
          type: '11',
          typeName: '平台节点',
          vendor: '广州睿颢',
        },
      ],
    }
    const statuses = ['offline', 'online', 'warning']
    const regionClassify = {
      DEVICE: 'DEVICE中文名',
      TSSC: 'TSSC中文名',
    }
    // 处理 mockData，将数据扁平化
    const flatData = Object.entries(mockData).reduce((acc, [key, items]) => {
      return acc.concat(
        items.map((item) => ({
          nodeName: item.name,
          ip: item.ip,
          port: item.port,
          status: statuses[item.status],
          type: item.typeName,
          region: regionClassify[key],
        }))
      )
    }, [])
    return flatData
    // const region = ['A区', 'B区', 'C区', 'D区', 'E区', 'F区']
    // const statuses = ['online', 'offline', 'warning']
    // const types = ['X1类型', 'X2类型', 'X3类型']
    // const data = []

    // for (let i = 1; i <= 15; i++) {
    //   const nodeNum = i.toString().padStart(2, '0')
    //   data.push({
    //     nodeName: `NODE${nodeNum}`,
    //     ip: `172.17.3.${100 + i}`,
    //     port: `${49800 + i}`,
    //     status: statuses[Math.floor(Math.random() * statuses.length)],
    //     region: region[Math.floor(Math.random() * region.length)],
    //     type: types[Math.floor(Math.random() * types.length)],
    //     nodeId: `20160${nodeNum}`
    //   })
    // }
    // return data
  } else if (type === 'chart') {
    const chartTypes = ['chart|line', 'chart|line', 'chart|line']
    return Array.from({ length: 12 }, (_, i) => ({
      title: `图表${i + 1}`,
      type: chartTypes[i % chartTypes.length],
      data: {
        xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
        series: [
          {
            name: '数据1',
            data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000)),
          },
          {
            name: '数据2',
            data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000)),
          },
        ],
      },
    }))
  }
  return []
}

// 计算分组后的显示数据
// const groupedDisplayData = computed(() => {
//   if (props.config.boxType !== 'status') return displayData.value
//   return groupedData.value
// })

// 计算每个区域的状态统计
const getRegionStats = (items) => {
  const stats = {
    online: 0,
    offline: 0,
    warning: 0,
  }
  items.forEach((item) => {
    stats[item.status]++
  })
  return stats
}

// 监听 props.data 的变化
// watch(() => props.data, () => {
//   updateDisplayData()
//   nextTick(() => {
//     updateLayout()
//   })
// }, { immediate: true })
</script>

<template>
  <div class="boxs-wrapper" ref="boxsWrapper">
    <div class="content-container">
      <div
        class="boxs-container"
        :style="{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
          gap: `${props.config.gap || 6}px`,
        }"
      >
        <template v-if="props.config.boxType === 'status'">
          <template v-for="(items, region) in groupedData" :key="region">
            <div class="region-header">
              <span>{{ region }}</span>
              <div class="status-stats">
                <div class="total-icon-stats">
                  <component :is="bgIconMap[props.config.cardConfig?.bgImage]" class="type-icon" />
                  <span class="total-number">{{ items.length }}</span>
                </div>
                <span class="stat-item online">
                  <span class="stat-dot"></span>
                  <span class="stat-count">{{ getRegionStats(items).online }}</span>
                </span>
                <span class="stat-item warning">
                  <span class="stat-dot"></span>
                  <span class="stat-count">{{ getRegionStats(items).warning }}</span>
                </span>
                <span class="stat-item offline">
                  <span class="stat-dot"></span>
                  <span class="stat-count">{{ getRegionStats(items).offline }}</span>
                </span>
              </div>
            </div>
            <div
              v-for="(item, index) in items"
              :key="item.nodeId"
              class="box-item"
              :style="{
                width: `${props.config.minWidth || 240}px`,
                height: '75px',
                padding: '0',
              }"
            >
              <component v-if="props.config.cardConfig?.bgImage" :is="bgIconMap[props.config.cardConfig.bgImage]" class="background-icon" />
              <StatusCard :data="item" />
            </div>
          </template>
        </template>
        <template v-else>
          <!-- 原有的图表显示逻辑 -->
          <div
            v-for="(item, index) in displayData"
            :key="index"
            class="box-item chart-box"
            :style="{
              width: `${props.config.minWidth || 240}px`,
              height: `${props.config.minHeight || 180}px`,
              padding: '2px',
            }"
          >
            <ChartCard :id="'child-' + index" :config="{ ...props.config.cardConfig, id: index }" :data="item" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.boxs-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.boxs-container {
  display: grid;
  padding: 12px;
  background: transparent;
  align-content: start;
  justify-content: start;
  width: fit-content;
}

.box-item {
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: transparent;
  border: none;
}

.box-item.chart-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.box-item.chart-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.background-icon {
  position: absolute;
  left: 65%;
  top: 50%;
  width: 100px;
  height: 65px;
  opacity: 0.1;
  transform: translate(-50%, -50%);
  pointer-events: none;
  color: rgba(255, 255, 255, 0.9);
  z-index: 0;
}

/* 确保卡片内容在图标上层 */
.box-item > :not(.background-icon) {
  position: relative;
  z-index: 1;
}

.region-header {
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  font-weight: 600;
  padding: 6px 10px;
  margin: 0px 0 2px;
  border-radius: 6px;
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
}

.status-stats {
  display: flex;
  gap: 12px;
  margin-right: 4px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: normal;
}

.stat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.stat-count {
  min-width: 14px;
  text-align: center;
}

.stat-item.online .stat-dot {
  background: #67c23a;
  box-shadow: 0 0 4px #67c23a;
}

.stat-item.warning .stat-dot {
  background: #e6a23c;
  box-shadow: 0 0 4px #e6a23c;
}

.stat-item.offline .stat-dot {
  background: #f60707;
  box-shadow: 0 0 4px #f60707;
}

.total-icon-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  /* padding: 2px 8px; */
  /* background: rgba(255, 255, 255, 0.1); */
  /* border-radius: 4px; */
  /* margin-right: 8px; */
}

.type-icon {
  width: 14px;
  height: 14px;
  opacity: 0.8;
}

.total-number {
  font-size: 12px;
  font-weight: 500;
  min-width: 16px;
  text-align: center;
}
</style>
