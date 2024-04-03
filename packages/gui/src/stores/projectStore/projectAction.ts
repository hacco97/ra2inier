import { Package, PackageVo, Reference, } from '@ra2inier/core';
import { exec, useLogger } from '@/boot/apis';
import { createEmpty, ProjectBoot } from './boot';


/**
 * 对当前project实例进行操作的action
 */
export function createProjectAction(boot: ProjectBoot) {
   const logger = useLogger('project-action')
   const { mergePackages, diffReference } = boot

   /**
    * 保存项目的info文件
    */
   function savePackageInfo(pkg: Package) {
      if (!pkg) return
      return exec('project/save-pkginfo', { data: pkg }).then(({ status, data }) => {
         if (!status) return void logger.warn('保存包信息失败', data)
         return true
      })
   }

   /**
    * 从磁盘加载包
    */
   async function loadLocalPackage(references: Reference[] | string[]) {
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
   async function downloadPackage(refers: Reference[]) {
      const tmp = refers.filter(x => !!x.url)
      if (!tmp.length) return []
      const { status, data } = await exec('download/remote-package', { data: tmp, timeout: 999_999_999_999 })
      if (!status) return void logger.warn('下载包失败') || []
      return <Reference[]>data
   }

   /**
    * 给定一个引用的集合，对该集合中的包进行加载，
    */
   async function loadPackage(addMap: Record<string, Reference>) {
      const [toAdd] = diffReference(addMap)
      if (!toAdd.length) return
      // 检查哪些包需要下载
      const loaded = await loadLocalPackage(toAdd)
      const toDownload: Reference[] = []
      for (const r of toAdd) {
         if (r.key in loaded) continue
         if (r.url) toDownload.push(r)
      }
      if (toDownload.length <= 0) return
      const downloaded = await downloadPackage(toDownload)
      const newLoaded = await loadLocalPackage(downloaded)
      // TODO:
   }

   return {
      savePackageInfo,
      loadLocalPackage,
      loadPackage,
      downloadPackage
   }
}

export const EMPTY_PROJECT_ACTION = createEmpty(createProjectAction)
