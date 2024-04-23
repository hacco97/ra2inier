import 'default-passive-events';
import '@ra2inier/wc';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import directives from './boot/directives';
import { forIn } from '@ra2inier/core';

const app = createApp(App)
app.use(createPinia())

// 注册全局指令
forIn(directives, (key, d) => app.directive(key, d))

app.mount('#app').$nextTick(() => {
   postMessage({ payload: 'removeLoading' }, '*')
})
export default app
