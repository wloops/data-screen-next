<template>
  <main class="dashboard-content" :style="layoutStyle">
    <template v-for="page in config?.pages" :key="page.id">
      <section v-show="currentPage === page.id" class="page-container">
        <div class="grid-container">
          <div v-for="i in 9" :key="i" class="grid-item">
            <!-- 数据卡片将在这里动态渲染 -->
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Page {
  id: string
  name: string
  have_tabs: boolean
  tabs: Array<{
    id: string
    name: string
    icon: string
    color: string
  }> | null
}

interface Config {
  project_name: string
  layout: {
    direction: string
    style: {
      margin: string
    }
    background: {
      color: string
      image: string
    }
  }
  pages: Page[]
}

const config = ref<Config | null>(null)
const currentPage = ref('')

// 计算布局样式
const layoutStyle = computed(() => ({
  margin: config.value?.layout?.style?.margin || '0',
  flexDirection: (config.value?.layout?.direction || 'column') as 'row' | 'column' | 'row-reverse' | 'column-reverse',
  background: config.value?.layout?.background?.color || 'transparent',
  backgroundImage: config.value?.layout?.background?.image ? `url(${config.value.layout.background.image})` : 'none',
}))

// 使用useFetch加载配置
const { data, error } = await useFetch<Config>('/layout.json', {
  key: 'layout-config',
  transform: (response) => {
    config.value = response
    currentPage.value = response.pages[0]?.id
    return response
  },
})

if (error.value) {
  console.error('Failed to load config:', error.value)
}
</script>

<style scoped>
.dashboard-content {
  height: calc(100vh - 60px);
  padding: 20px;
  display: flex;
}

.page-container {
  width: 100%;
  height: 100%;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  height: 100%;
}

.grid-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 15px;
}
</style>
