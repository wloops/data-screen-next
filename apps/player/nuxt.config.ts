// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['@/assets/css/main.css'],
  modules: ['nuxt-icon', '@vueuse/nuxt', '@nuxt/ui','@unocss/nuxt'],
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  ui: {
    global: true,
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  }
});
