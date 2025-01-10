<script setup lang="ts">
import type { Page } from '../../../types/layout'

interface LayoutItem {
  id?: string
  flexRatio: number
  innerBoxs: Array<{ id?: string; flexRatio: number; name?: string }>
}

const props = defineProps<{
  layoutConfig: LayoutItem[]
  pageConfig: Page
}>()

const setSpacePercent = (ratio: number, index: number) => {
  let ratioPlus = 0
  const direction = props.pageConfig.layoutModel === 'column' ? 'width|height' : 'height|width'
  if (index === -1) {
    props.layoutConfig.forEach((item: any) => {
      ratioPlus += item.flexRatio
    })
  } else {
    props.layoutConfig[index].innerBoxs.forEach((innerBox: any) => {
      ratioPlus += innerBox.flexRatio
    })
  }

  const percent = ((ratio / ratioPlus) * 100).toFixed(2)
  // console.log('percent::', percent)
  return index === -1 ? `${direction.split('|')[0]}: ${percent}%` : `${direction.split('|')[1]}: ${percent}%`
}
</script>

<template>
  <div w-full h-full flex justify-center items-center>
    <div id="canvas-main" text-coolGray-300 w-full h-full pt-0>
      <div
        :class="{
          'column-wrap': props.pageConfig.layoutModel === 'column',
          'row-wrap': props.pageConfig.layoutModel === 'row',
          'grid-wrap': props.pageConfig.layoutModel === 'grid',
        }"
        w-full
        h-full
        pr-3
        pb-3
        flex
      >
        <div
          v-for="(item, index) in props.layoutConfig"
          :key="item.id || index"
          :class="{ 'flex-col': props.pageConfig.layoutModel === 'column' }"
          w-full
          h-full
          flex
          justify-center
          items-center
          m-5
          :style="setSpacePercent(item.flexRatio, -1)"
        >
          <div
            v-for="(innerBox, innerIndex) in item.innerBoxs"
            :key="innerBox.id || `${index}-${innerIndex}`"
            :style="setSpacePercent(innerBox.flexRatio, index)"
            class="innerBox"
            :value="innerBox.id"
            w-full
            h-full
            m-5
          >
            <div :class="!innerBox.name ? 'innerBox-content-notTitle' : 'innerBox-content'" w-full h-full :data-text="innerBox.name">
              <AppBlocks :key="innerBox.id" :id="innerBox.id" :style="`height: ${!innerBox.name ? '100%' : 'calc(100% - 40px)'};`" :data="innerBox"> </AppBlocks>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.innerBox {
  /* border: 2px dashed #76c1f3; */
  cursor: pointer;
  /* 鼠标悬浮高亮 */
  transition: all 0.3s ease-in-out;
}

/* .innerBox:hover {
  border: 2px dashed #2ec23c;
}

.innerBox:active {
  border: 2px dashed #2ec23c;
}

.actived {
  border: 2px dashed #2ec23c;
} */

.column-wrap {
  @apply flex flex-row justify-center items-center;
}

.row-wrap {
  @apply flex flex-col justify-center items-center;
}

.grid-wrap {
  @apply flex flex-wrap justify-center items-center;
}

.innerBox-content,
.innerBox-content-notTitle {
  position: relative;
  background: transparent;
  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.15);
  border: 2px dashed rgba(64, 121, 226, 0.35);

  display: flex;
  justify-content: center;
  align-items: end;
  transition: 0.5s;
  border-radius: 10px;
  padding-bottom: 5px;
  /* margin: 10px; */
  /* backdrop-filter: blur(10px); */
  transform: rotate(calc(var(--r) * 1deg));

  .chart {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    justify-content: center;
    align-items: end;
  }

  .glass-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    margin-left: 5px;
    cursor: pointer;
    z-index: 1;
  }
}

.innerBox-content::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  border-radius: 10px 10px 0 0;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
