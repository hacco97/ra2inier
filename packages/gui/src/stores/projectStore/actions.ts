import { ref } from 'vue';
import { Package, parseProjectVo, ProjectVo, Reference, } from '@ra2inier/core';
import { exec, globalEvent, work } from '@/boot/apis';
import { useConfig } from '../config';
import useLog from '../messageStore';
import { saveObject } from './';
import { clearAll, project, ValueSetKey, ValueSetType } from './boot';
import { saveMapper, saveScope, saveWord } from './metaStore';

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

/**
 * 重新打开一个项目
 */
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
 * 通过文件资源管理器，打开项目
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
 * 保存项目的info文件
 */
export function savePackageInfo(pkg: Package) {
   if (!pkg) return
   return exec('project/save-pkginfo', { data: pkg }).then(({ status, data }) => {
      if (!status) return void logger.warn('保存包信息失败', data)
      return true
   })
}

/**
 * 从磁盘加载包，如果本地没有则会根据所提供的url在远程下载
 */
export function loadLocalPackage(references: Reference[]) {
   exec('project/load-package', { references }).then(({ status, data }) => {
      if (!status) return logger.warn('加载包出错', data)
      console.log(data)

   })
}


export async function downloadRemotePackage(refers: Reference[]) {
   const tmp = refers.filter(x => !!x.url)
   const { status, data } = await exec('download/remote-package', { data: tmp })
   if (!status) return void logger.warn('下载包失败') || []
   console.log(data)

   return <Reference[]>data
}
