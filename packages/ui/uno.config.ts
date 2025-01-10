import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'
// import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,700',
        mono: 'DM Mono:400,600',
      },
    }),
    // presetScrollbar(),
  ],
  shortcuts: {
    'bg-base': 'bg-white dark:bg-dark-800',
    'bg-overlay': 'bg-[#fafafa] dark:bg-dark-700',
    'border-base': 'border-gray-200 dark:border-dark-600',
    'text-base': 'text-gray-900 dark:text-gray-300',
    'text-secondary': 'text-gray-700 dark:text-gray-200',
  },
  theme: {
    colors: {
      dark: {
        50: '#f6f6f7',
        100: '#e0e2e7',
        200: '#c1c5ce',
        300: '#9ba1ae',
        400: '#757b8c',
        500: '#595f6e',
        600: '#444754',
        700: '#35373f',
        800: '#2a2b30',
        900: '#212224',
      },
    },
  },
})
