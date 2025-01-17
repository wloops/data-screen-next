<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { useProceResponseData } from '../../hooks/useProceResponseData'

interface BlockItem {
  id: string
  type: string
  fatherID: string
  flexRatio: number
  remote?: {
    mode: string
    params: Array<{
      groupId: string
      itemId: string
      wsId?: string
    }>
  }
  width?: string
  height?: string
}

interface BlockData {
  direction: 'column' | 'row'
  children: BlockItem[]
}

const props = defineProps<{
  data: BlockData
}>()

const baseUrlWs = localStorage.getItem('baseUrlWs') || ''

const {
  data: wsData,
  status,
  send,
  close,
} = useWebSocket(baseUrlWs, {
  autoReconnect: true,
  onMessage: (ws: WebSocket, event: MessageEvent) => {
    console.log('WebSocket收到 更新 消息', event.data)
    handleMessage(event.data)
  },
})

const isApply = ref(false)
const componentKey = ref(0)
const dynamicComponents: Record<string, any> = reactive({})
const blockTabs: Record<string, any> = reactive({})

const requestList = ref<BlockItem[]>([])
const wsMessageList = ref<BlockItem[]>([])

onMounted(async () => {
  const modules = import.meta.glob('./common/*.vue')
  console.log('modules::', modules)

  for (const path in modules) {
    const module = await modules[path]()
    const componentName = path.replace(/^\.\/common\/(.*)\.vue$/, '$1')
    dynamicComponents[componentName] = markRaw(module.default)
  }

  for (const key in dynamicComponents) {
    const component = dynamicComponents[key]
    if (component.__name) {
      blockTabs[component.__name] = component
    }
  }
  console.log('blockTabs::', blockTabs)

  isApply.value = false
  props.data.children?.forEach((item) => {
    item.remote && waitRequestList(item)
  })
  console.log('wsMessageList::', wsMessageList.value)
  wsMessageList.value.length > 0 && sendWsMessage()
  isApply.value = true
})

const waitRequestList = (item: BlockItem) => {
  requestList.value.push(item)
  if (item.remote?.mode === 'ws') {
    wsMessageList.value.push(item)
  }
}

const componentData = ref<Record<string, any>>({})

function handleMessage(e: string) {
  const message = JSON.parse(e)
  isApply.value = false
  console.log('WebSocket收到 更新 消息', message.itemId, message)

  wsMessageList.value.forEach((item) => {
    item.remote?.params.forEach((param) => {
      if (param.groupId === message.groupId && param.itemId === message.itemId) {
        // TODO: 实现 useProceResponseData 或从其他地方导入
        const newdata = useProceResponseData(param.wsId, message.data)
        componentData.value[item.id] = { ...componentData.value[item.id], ...newdata }
      }
    })
  })
  isApply.value = true
}

// function getWsMsgForID(list: BlockItem[]) {
//   let data = {}
//   if (!list || list.length === 0) return data
//   list.forEach((item) => {
//     data = item.data
//     componentData.value[item.id] = item.data
//   })
//   componentKey.value++
// }

const setSpacePercent = (item: BlockItem) => {
  const { type, flexRatio: ratio } = item
  const dom = document.getElementById(`${item.fatherID}`)
  if (!dom) return
  const width = dom.clientWidth
  const height = dom.clientHeight

  let ratioPlus = 0
  const direction = props.data.direction === 'column' ? 'width|height' : 'height|width'
  props.data.children.forEach((innerBox) => {
    ratioPlus += innerBox.flexRatio
  })

  const percent = ((ratio / ratioPlus) * 100).toFixed(2)

  if (direction.split('|')[0] === 'width') {
    item.width = `${(width * Number(percent)) / 100}px`
    item.height = `${height}px`
  } else {
    item.width = `${width}px`
    item.height = `${(height * Number(percent)) / 100}px`
  }
  return `${direction.split('|')[0]}: ${percent}%`
}

const getTypeName = (type: string) => {
  if (!type) return ''
  if (type.includes('|')) {
    return type.split('|')[0]
  }
  return type
}

async function sendWsMessage() {
  const list = wsMessageList.value
  if (list.length > 0) {
    list.forEach((item) => {
      item.remote?.params.forEach((param) => {
        const data = {
          groupId: param.groupId,
          itemId: param.itemId,
        }
        send(JSON.stringify(data))
      })
    })
  }
}
</script>

<template>
  <div w-full h-full flex :class="{ 'flex-col': props.data.direction !== 'column' }">
    <template v-for="(item, index) in props.data.children" w-full h-full flex justify-center items-center :id="'group-' + item.id" :key="index">
      <component :is="blockTabs[getTypeName(item.type)]" :id="'child-' + item.id" :config="item" :data="componentData[item.id]" :style="setSpacePercent(item)" w-full h-full> </component>
    </template>
  </div>
</template>

<style scoped>
.flex-col {
  flex-direction: column;
}
</style>
