import { computed, ComputedGetter, ref } from 'vue';

import { exec, globalEvent, work } from '@/boot/apis';
import {
   diffArray,
   forIn, IniObjectRo, MapperRo, Package, PackageRo, parseProjectVo,
   ProjectInfo, ProjectVo, Reference, ScopeRo, WordRo,
} from '@ra2inier/core';

import { useConfig } from '../config';
import useLog from '../messageStore';
import { saveObject } from './';
import { clearAll, mainKey, project, ValueSetKey, ValueSetType } from './boot';
import { saveMapper, saveScope, saveWord } from './metaStore';

export * from './metaStore'
export * from './iniObjectStore'


// 项目数据仓库
const logger = useLog('project-store')
export const loadingVersion = ref(0)

function updateProject(ipkg: ProjectVo) {
   // 打开项目核心逻辑
   clearAll()
   parseProjectVo(ipkg, project)

   // 将初始数据传递给worker
   work('project/init', ipkg)
   globalEvent.emit('project-loaded')

   // 结束
   loadingVersion.value++
}


/**
 * 打开一个项目
 */
export function openProject(path?: string) {
   if (project.loaded) return logger.info('项目已经加载')
   project.loading = true
   path = path || useConfig().PROJECT_PATH
   console.log('123')

   exec<ProjectVo>('project/open', { path }).then((res) => {
      const ipkg = res.data
      if (!res.status || !ipkg) {
         project.loaded = false
         return logger.warn('加载项目失败', ipkg ?? "项目文件损坏")
      }
      updateProject(ipkg)
      project.loaded = true
      project.loading = false
   })
}

export function reloadProject(path: string) {
   exec<boolean>('project/check-path', { data: path }).then((res) => {
      if (res.data && res.status) {
         project.loaded = false
         openProject(path)
      } else {
         logger.warn('项目路径不正确', path)
      }
   })
}

/**
 * 打开项目
 */
export function openNewProject() {
   exec<string[]>('dialog/open/dir').then((res) => {
      if (res.status) {
         reloadProject(res.data[0])
      } else {
         logger.warn('项目打开失败：', res.data)
      }
   })
}

/**
 * 保存项目
 */
export function saveProject() {
   if (!project.main) return logger.warn('当前无项目')
   exec('project/save', { data: project }).then(({ status, data }) => {
      if (!status) return logger.warn('保存项目失败', data)
      logger.info('保存项目成功')
   })
}

/**
 * 新建一个空项目
 */
export function createNewProject(path: string, name: string) {
   exec<ProjectVo>('project/new', { path, name }).then(({ status, data }) => {
      if (!status || !data) return logger.warn('新建项目失败', data)
      updateProject(data)
   })
}


/**
 * 保存一个值，制定类型保存值
 */
export function saveValue<T extends ValueSetKey>(type: T, value: ValueSetType[T]) {
   SAVE_MAP[type](value)
}
const SAVE_MAP: Record<ValueSetKey, Function> = {
   mappers: saveMapper,
   objects: saveObject,
   dictionary: saveWord,
   scopes: saveScope
}


/**
 * 项目构建逻辑
 */
let building = false
/**
 * 构建项目
 */
export function build() {
   if (building) return
   const buildList: string[] = []
   // TODO: 从UI读取BuildList，此处暂时为全部构建
   forIn(all.value.objects, (key, val) => { buildList.push(key) })
   work<boolean>('project/build', buildList).then(({ status, data }) => {
      if (status) {
         logger.info('构建成功')
      } else {
         logger.warn('构建失败', data)
      }
   })
}

/**
 * 自定义computed，让computed的值依赖于loadingVersion
 */
export function loaderComputed<T>(f: ComputedGetter<T>) {
   return computed((o?: T) => {
      if (project.loadable) openProject()
      loadingVersion.value
      return f(o)
   })
}

/**
 * 使用vue包装数据使得数据具有响应性
 */
export const projectName = loaderComputed(() => {
   return project.main ? project.main.name : ''
})

export const mainPackage = loaderComputed(() => {
   return project.main ? project.main : new PackageRo
})

export const referPackages = loaderComputed(() => {
   const refers = { ...project.packages }
   delete refers[mainKey()]
   return refers
})

export const packages = loaderComputed(() => {
   return project.packages
})

export const projectInfo = loaderComputed(() => {
   return new ProjectInfo(project)
})

/**
 * 保存项目的info文件
 */
export function savePackageInfo(pkg: Package) {
   if (!pkg) return
   return exec('project/save-pkginfo', { data: pkg }).then(({ status, data }) => {
      if (!status) return void logger.warn('保存包信息失败', data)
      return true
   })
}

export function addReference(toAdd: Reference[]) {
   savePackageInfo(mainPackage.value)?.then((ret) => {
      if (ret) exec('project/save-refer', { toAdd })
         .then(({ status, data }) => {
            if (!status) logger.warn('添加引用包失败', data)
         })
   })
}


/**
 * 从磁盘加载包，如果本地没有则会根据所提供的url在远程下载
 */
export function loadLocalPackage(references: Reference[]) {
   exec('project/load-package', { references }).then(({ status, data }) => {
      if (!status) return void logger.warn('加载包出错', data)
      console.log(data)

   })
}


/**
 * 修改引用
 */
export function setReference(list: Reference[]) {
   const [toKeep, toAdd, toDel] =
      diffArray(list, projectInfo.value.references, (a, b) => a.key === b.key)
   // addReference(toAdd)
   loadLocalPackage(toAdd)
}

/**
 * 通过包的键值获得包名
 */
export const packageNames = loaderComputed(() => {
   const map: Record<string, string> = {}
   forIn(project.packages, (key, pkg) => {
      map[key] = pkg.name
   })
   return map
})


/**
 * 返回全部项目资源的可读集合
 */
export const all = loaderComputed(() => {
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


/**
 * 查找项目中的对象
 */
export function queryObject<T extends ValueSetKey>(type: T,
   filter: (v: ValueSetType[T]) => number, limit = 20) {
   const targetSet = all.value[type]
   const ret: [number, any][] = []
   forIn(<Record<string, any>>targetSet, (key, val) => {
      const priority = filter(val)
      if (priority > 0) ret.push([priority, val])
   })
   ret.sort((a, b) => a[0] - b[0])
   const temp = []
   for (let i = 0; i < limit && i < ret.length; ++i) { temp.push(ret[i][1]) }
   return <ValueSetType[T][]>(temp.reverse())
}
