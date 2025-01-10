// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['@/assets/css/main.css'],
  modules: ['nuxt-icon', '@vueuse/nuxt', '@nuxt/ui', '@unocss/nuxt'],
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  ui: {
    global: true,
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },
  unocss: {
    // unocss 配置
    nuxtLayers: true,
    uno: true, // 启用默认预设
    icons: true, // 启用图标
    attributify: true, // 启用属性化模式
  },
})
