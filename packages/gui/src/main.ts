import { createApp } from "vue"
import App from './App.vue'
import { forIn } from "@ra2inier/core"
import directives from "./boot/directives"
import 'default-passive-events'

const app = createApp(App)

// 注册全局指令
forIn(directives, (key, d) => app.directive(key, d))

app.mount('#app').$nextTick(() => {
   postMessage({ payload: 'removeLoading' }, '*')
})
export default app
