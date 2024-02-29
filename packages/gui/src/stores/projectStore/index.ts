import { computed, ref } from 'vue';

import { eventBus, exec, work } from '@/boot/apis';
import {
  forIn, IniObjectRo, MapperRo, PackageRo, parseProjectVo,
  ProjectRo, ProjectVo, ScopeRo, WordRo,
} from '@ra2inier/core';

import { useConfig } from '../config';
import useLog from '../messageStore';
import { clearAll, project } from './boot';

export * from './metaStore'
export * from './iniObjectStore'
export * from './infoStore'

// 项目数据仓库
const log = useLog('project-store')
export const loadingVersion = ref(0)

export async function openProject(path?: string, callback?: () => {}) {
   if (project.loaded) return log.info('项目已经加载')
   project.loading = true
   path = path ?? useConfig().PROJECT_PATH
   await exec<ProjectVo>('project/open', { path }).then((res) => {
      const ipkg = res.data
      if (!res.status || !ipkg) {
         project.loaded = false
         return log.warn('加载项目失败', ipkg ?? "项目文件损坏")
      }

      // 打开项目核心逻辑
      parseProjectVo(ipkg, project)
      // 将初始数据传递给worker
      work('project/init', ipkg)
      eventBus.emit('project-loaded')

      // 结束
      loadingVersion.value++
      project.loaded = true
      project.loading = false
      callback?.()
   })
}

export async function reloadProject(path: string) {
   await exec<boolean>('project/check-path/' + path).then((res) => {
      if (res.data && res.status) {
         project.loaded = false
         clearAll()
         openProject(path)
      } else {
         log.warn('项目路径不正确', path)
      }
   })
}

export function openNewProject() {
   exec<string[]>('dialog/open/dir').then((res) => {
      if (res.status) {
         reloadProject(res.data[0])
      } else {
         log.warn('项目打开失败：', res.data)
      }
   })
}

/**
 * 项目构建逻辑
 * ***********************************************************************************************
 */
let building = false
/**
 * 构建项目
 */
export async function build() {
   if (building) return
   const buildList: string[] = []

   // TODO: 从UI读取BuildList，此处暂时为全部构建
   forIn(useAll().value.objects, (key, val) => { buildList.push(key) })

   const res = await work<boolean>('project/build', buildList)
   if (res.status) {
      console.log('构建成功')
   } else {
      console.log('构建失败', res.data)
   }
}


/**
 * 使用vue包装数据使得数据具有响应性
 */
export const projectName = computed(() => {
   loadingVersion.value
   return project.main ? project.main.name : ''
})

export const mainPackage = computed(() => {
   loadingVersion.value
   return project.main ? project.main : new PackageRo
})

export const projectInfo = computed(() => {

})


/**
 * 返回当前项目的资源集合
 */
export function useProject() {
   if (project.loadable) openProject()
   return _project
}
const _project = computed(() => {
   loadingVersion.value
   return <Readonly<ProjectRo>>project
})



/**
 * 返回全部项目资源的可读集合
 */
export function useAll() {
   if (project.loadable) openProject()
   return _allResource
}
const _allResource = computed(() => {
   loadingVersion.value
   return {
      objects: mergeKey<IniObjectRo>(project.packages, 'objects'),
      scopes: mergeKey<ScopeRo>(project.packages, 'scopes'),
      mappers: mergeKey<MapperRo>(project.packages, 'mappers'),
      dictionary: mergeKey<WordRo>(project.packages, 'dictionary')
   }
})

function mergeKey<T>(packages: Record<string, PackageRo>, readKey: string) {
   const tmp: Record<string, any> = {}
   forIn(packages, (key, pkg) => {
      forIn(pkg[readKey], (key, obj) => {
         tmp[key] = obj
      })
   })
   return <Readonly<Record<string, T>>>tmp
}

