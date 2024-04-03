import { exec } from "@/boot/apis"
import { defineStore } from "pinia"
import { ref, watch } from "vue"

// 主题和皮肤控制模块
export enum Theme {
   dark = 'dark',
   light = 'light',
   all = 'all',
   sov = 'sov',
   ep = 'ep',
   foe = 'foe',
   yunru = 'yunru',
   libra = 'libra'
}

const createThemeState = () => {
   const theme = ref<Theme>(Theme.dark)

   let themePath = ''

   let style = document.querySelector('#theme-ctrl')
   if (style) {
      exec<string>('get:config/theme-path').then((val) => {
         themePath = `${import.meta.env.VITE_PROTOCOL}://${val}/`
      })
      watch(theme, () => {
         if (!style) style = document.querySelector('#theme-ctrl')
         if (style) style.setAttribute('href', themePath + theme.value + '.css')
      })
   }


   return {
      theme,
   }
}

export const useThemeState = defineStore('theme-state', { state: createThemeState })
export type ThemeState = ReturnType<typeof useThemeState>
