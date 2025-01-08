<script setup lang="ts">
import type { LayoutConfig, Page } from '~/types/layout'
const props = defineProps<{
  layoutConfig: LayoutConfig
  currentPage?: Page
  selectedPageId: string
  handlePageChange: (pageId: string) => void
}>()

const emit = defineEmits<{
  'update:newPage': [Page | undefined]
}>()

const pageItems = props.layoutConfig?.pages?.map((page) => [
  {
    label: page.name,
    icon: page?.style?.icon,
    // value: page.id,
    click: () => {
      console.log('click', page.id)
      props.handlePageChange(page.id)
    },
  },
])
</script>

<template>
  <div>
    <div class="header-center">
      <UDropdown :popper="{ placement: 'bottom' }" :items="pageItems" v-model="props.selectedPageId">
        <UButton variant="ghost" color="gray" class="title-select">
          <template #leading>
            <Icon :name="currentPage?.style?.icon || 'mdi:monitor'" class="title-icon" />
            <h1 class="title">{{ currentPage?.name || '监控页面' }}</h1>
          </template>
          <template #trailing>
            <Icon name="solar:double-alt-arrow-down-line-duotone" class="select-icon" />
          </template>
        </UButton>
      </UDropdown>
    </div>
  </div>
</template>

<style scoped>
.title {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(to bottom, #fff, #7cb9ff);
  background-clip: text;
  color: transparent;
}

.title-icon {
  width: 25px;
  height: 25px;
  margin-right: 1px;
  background: linear-gradient(to bottom, #fff, #7cb9ff);
}

.title-select {
  background: transparent;
  border: none;
}

.title-select:hover {
  background: rgba(255, 255, 255, 0.1);
}

.select-icon {
  color: #7cb9ff;
  width: 18px;
  height: 18px;
  transition: transform 0.2s;
}
</style>
