
import { defineStore } from 'pinia'
import { EMPTY_BOOT, createProject } from './boot'
import { EMPTY_PROJECT_ACTION, createProjectAction } from './projectAction'
import { EMPTY_OBJECT_ACTION, createObjectAction } from './objectAction'
import { EMPTY_MEAT_ACTION, createMetaAction } from './metaAction'
import { EMPTY_DERIVED, createDerived } from './derived'
import { ProjectVo } from '@ra2inier/core'
import { globalEvent, makeExecMethod } from '@/boot/apis'
import { useConfigStore } from '../config'
import { useDisabled } from '@/hooks/disabledFn'

export * from '../build'

function parseProjectVo(vo: ProjectVo) {
   globalThis.projectVo = vo
   console.log(vo)
   useProjectStore().$reset()
   globalEvent.emit('project-loaded')
   return vo
}

/**
 * 全局静态函数，打开一个项目
 */
export const openProject = useDisabled(makeExecMethod<ProjectVo>('project/open', '打开项目失败')
   .comp((path?: string) => {
      path = path || useConfigStore().config.PROJECT_PATH
      return { path }
   })
   .pipe(parseProjectVo).value)[0]

/**
 * 立即执行一次打开项目的操作
 */
openProject('')


/**
 * 通过文件资源管理器，打开一个项目
 */
export const openProjectFromBrowser = useDisabled(makeExecMethod<string[]>('dialog/open/dir')
   .pipe(([path]) => openProject(path)).value)[0]

/**
 * 全局静态函数，保存项目
 */
export const saveProject = makeExecMethod<boolean>('project/save', '保存项目失败')
   .comp((x: ProjectVo) => ({ data: x })).value


/**
 * 新建一个项目
 */
export const newProject = makeExecMethod<ProjectVo>('project/new', '创建项目失败')
   .comp((o: { path: string, name: string }) => o)
   .pipe((vo) => {
      if (vo) parseProjectVo(vo)  // 如果成功创建，就打开这个项目
   }).value


/**
 * 关闭项目的逻辑
 */
export const closeProject = () => {
   // TODO: 保存内容的操作

   globalThis.projectVo = undefined
   useProjectStore().$reset()
   globalEvent.emit('project-loaded')
}

/**
 * 项目数据仓库，项目当前的数据总和
 */
export const useProjectStore = defineStore('project-store', {
   state: () => {
      if (!globalThis.projectVo) {
         return {
            ...EMPTY_BOOT,
            ...EMPTY_DERIVED,
            ...EMPTY_MEAT_ACTION,
            ...EMPTY_OBJECT_ACTION,
            ...EMPTY_PROJECT_ACTION
         }
      }
      /**
       * 初始化项目数据
       */
      const projectBoot = createProject(globalThis.projectVo)
      const derived = createDerived(projectBoot)

      const projectAction = createProjectAction(projectBoot)
      const metaAction = createMetaAction(projectBoot)
      const objectAction = createObjectAction(projectBoot)

      return {
         ...projectBoot,
         ...derived,
         ...projectAction,
         ...metaAction,
         ...objectAction
      }
   }
})

export type ProjectStore = ReturnType<typeof useProjectStore>
