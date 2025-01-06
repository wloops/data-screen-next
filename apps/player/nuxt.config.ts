// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['@/assets/css/main.css'],
  modules: ['nuxt-icon', '@vueuse/nuxt'],
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  }
});
