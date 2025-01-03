<template>
  <main class="dashboard-content">
    <div class="grid-container">
      <!-- 预留9个网格区域用于放置数据卡片 -->
      <div v-for="i in 9" :key="i" class="grid-item">
        <!-- 后续添加具体的数据卡片组件 -->
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard-content {
  height: calc(100vh - 60px);
  padding: 20px;
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
