// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: ['@/assets/css/main.css'],
  modules: ['nuxt-icon'],
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  }
});
