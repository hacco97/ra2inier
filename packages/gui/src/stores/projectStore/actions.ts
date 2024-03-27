import { ref } from 'vue';
import { forIn, Package, PackageVo, parsePackages, ProjectVo, Reference, } from '@ra2inier/core';
import { exec, globalEvent, work } from '@/boot/apis';
import { useConfigStore } from '../config';
import useLog from '../messageStore';
import { saveObject } from './iniObjectStore';
import { clearAll, project, setPackage, setReference, ValueSetKey, ValueSetType } from './boot';
import { saveMapper, saveScope, saveWord } from './metaStore';

const logger = useLog('project-store')
const { config } = useConfigStore()
export const loadingVersion = ref(0)

function updateProject(ipkg: ProjectVo) {
   // 打开项目核心逻辑
   clearAll()
   const pkgs = parsePackages(ipkg.packages)
   forIn(pkgs, (key, pkg) => { setPackage(key, pkg) })
   project.main = pkgs[ipkg.main]

   // 将初始数据传递给worker
   work('project/init', ipkg)
   globalEvent.emit('project-loaded')
   globalEvent.emit('package-loaded')

   // 结束
   loadingVersion.value++
}

/**
 * 向当前项目资源结合中添加新的资源集合
 */
function mergePackages(pkgs: Record<string, PackageVo>) {
   const parsed = parsePackages(pkgs)
   forIn(parsed, (key, pkg) => {
      setPackage(key, pkg)
      setReference(key, new Reference(pkg))
   })

   globalEvent.emit('package-loaded')
   console.log('merged')

   loadingVersion.value++
}

/**
 * 打开一个项目
 */
export function openProject(path?: string) {
   if (project.loaded) return logger.info('项目已经加载')
   project.loading = true
   path = path || config.PROJECT_PATH
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
export function openProjectFromBrowser() {
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
 * 修改当前主包的引用
 */
export function saveReference(references: Record<string, Reference>) {

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
 * 从磁盘加载包
 */
export async function loadLocalPackage(references: Reference[] | string[]) {
   if (!references.length) return {}
   let option: any = {}
   if (typeof references[0] === 'string') option.paths = references
   else option.references = references
   return exec<Record<string, PackageVo>>('project/load-package', option).then(({ status, data }) => {
      if (!status) return void logger.warn('加载包出错', data) || {}
      mergePackages(data)
      return data
   })
}


/**
 * 下载远程包，下载的时候会检查是否存在url属性如果不存在
 */
export async function downloadRemotePackage(refers: Reference[]) {
   const tmp = refers.filter(x => !!x.url)
   if (!tmp.length) return []
   const { status, data } = await exec('download/remote-package', { data: tmp, timeout: 999_999_999_999 })
   if (!status) return void logger.warn('下载包失败') || []
   return <Reference[]>data
}

/**
 * 在已经加载的包中，将不再需要的包移除，找出还没有加载的包
 * @returns [toAdd, toDel] - packages to add and removed packages' keys
 */
export function diffReference(references: Record<string, Reference>) {
   // 删去多余的包
   const toDel = []
   for (const key in project.packages) {
      if (key in references) continue
      setPackage(key, undefined)
      setReference(key, undefined)
      toDel.push(key)
   }
   work('package/remove', toDel)
   // 确定未加载的包
   const toAdd: Reference[] = []
   for (const key in references) {
      setReference(key, references[key])
      if (key in project.packages) continue
      toAdd.push(references[key])
   }
   return [toAdd, toDel] as const
}

/**
 * 给定一个引用的集合，对该集合中的包进行加载，
 */
export async function loadPackage(addMap: Record<string, Reference>) {
   const [toAdd] = diffReference(addMap)
   console.log(toAdd)
   if (!toAdd.length) return
   // 检查哪些包需要下载
   const loaded = await loadLocalPackage(toAdd)
   const toDownload: Reference[] = []
   for (const r of toAdd) {
      if (r.key in loaded) continue
      if (r.url) toDownload.push(r)
   }
   if (toDownload.length <= 0) return
   const downloaded = await downloadRemotePackage(toDownload)
   const newLoaded = await loadLocalPackage(downloaded)
   console.log(newLoaded)

}
