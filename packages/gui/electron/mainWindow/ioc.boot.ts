
// 导入所有services、daos文件夹下的文件
import.meta.glob('./daos/**/*.ts', { eager: true })
import.meta.glob('./services/**/*.ts', { eager: true })
import.meta.glob('./components/**/*.ts', { eager: true })

// 在开发环境下加载测试类
if (import.meta.env.DEV) {
   import.meta.glob('./test/**/*.ts', { eager: true })
}

import d from './ioc.config'
export const createIoc = d
