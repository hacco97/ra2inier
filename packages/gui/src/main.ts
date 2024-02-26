import 'default-passive-events';
import '@ra2inier/wc';

import { createApp } from 'vue';

import { forIn } from '@ra2inier/core';

import App from './App.vue';
import directives from './boot/directives';

const app = createApp(App)

// 注册全局指令
forIn(directives, (key, d) => app.directive(key, d))

app.mount('#app').$nextTick(() => {
   postMessage({ payload: 'removeLoading' }, '*')
})
export default app
