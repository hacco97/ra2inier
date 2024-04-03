
import { defineStore } from 'pinia'
import { EMPTY_BOOT, createProject } from './boot'
import { EMPTY_PROJECT_ACTION, createProjectAction } from './projectAction'
import { EMPTY_OBJECT_ACTION, createObjectAction } from './objectAction'
import { EMPTY_MEAT_ACTION, createMetaAction } from './metaAction'
import { EMPTY_DERIVED, createDerived } from './derived'
import { ProjectVo } from '@ra2inier/core'
import { globalEvent, makeExecMethod } from '@/boot/apis'
import { useConfigStore } from '../config'

export * from '../build'

/**
 * 全局静态函数，打开一个项目
 */
export const openProject = makeExecMethod<ProjectVo>('project/open', '打开项目失败')
   .comp((path?: string) => {
      path = path || useConfigStore().config.PROJECT_PATH
      return { path }
   })
   .pipe((vo) => {
      globalThis.projectVo = vo
      useProjectStore().$reset()
      globalEvent.emit('project-loaded')
      return vo
   }).value

/**
 * 立即执行一次打开项目的操作
 */
openProject('')


/**
 * 通过文件资源管理器，打开一个项目
 */
export const openProjectFromBrowser = makeExecMethod<string[]>('dialog/open/dir')
   .pipe(([path]) => openProject(path)).value

/**
 * 全局静态函数，保存项目
 */
export const saveProject = makeExecMethod<boolean>('project/save', '保存项目失败')
   .comp((x: ProjectVo) => ({ data: x })).value


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
