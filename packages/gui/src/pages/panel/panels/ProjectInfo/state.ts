import { useGlobalPackages } from '@/stores/staticStore';
import { reactive, ref, watch } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { PackageRo, ProjectRo, Reference, forIn } from "@ra2inier/core"
import { IItem } from '@/components/ListViewState';
import { Package, fromRaw } from '@ra2inier/core';

export class ProjectInfo {
   /**
    * 当前项目的名称
    */
   name = ''
   /**
    * 项目作者
    */
   author = ''
   /**
    * 项目的目标环境
    */
   target = ''
   /**
    * 项目的引用列表
    */
   references: ReferItem[] = []

   constructor(project?: ProjectRo) {
      if (!project) return
      const main = project.main || new PackageRo
      this.name = project.name || '?'
      this.author = main.author || '?'
      this.target = main.target
      this.references = []
      for (let r of Object.values(main.references)) {
         this.references.push(refer2ReferItem(r))
      }
   }
}

export function createProjectInfo(project: ProjectRo) {
   const info = new ProjectInfo(project)
   for (const r of info.references) {
      r.detail = DetailType.loaded
      if (r.key in project.packages) {
         r.path = project.packages[r.key].path
      }
   }
   return reactive(info)
}

export class ReferItem implements IItem, Partial<Reference> {
   /**
    * 包名->Reference
    */
   name: string = ''
   /**
    * 包的本地路径-> ??
    */
   path: string = ''
   /**
    * 包的键值->IItem、Reference
    */
   key: string = ''
   /**
    * 包的远程地址->Reference
    */
   url = ''
   /**
    * 依赖的版本->Reference
    */
   version = 0
   /**
 * 列表项目的显示值->IItem
 */
   value: string = ''
   /**
    * 列表项是否被选中->IItem
    */
   selected: boolean = false
   /**
    * 列表项中的细节->IItem
    * 显示当前项目的依赖项
    * 依赖项可以分为两种形态，已经加载的和未加载的
    * 未加载的包为虚悬依赖，实际上当前内存中没有该包的数据，不能够参与当前项目的构建
    */
   detail: DetailType = DetailType.none
}

export enum DetailType {
   loaded = '已加载',
   unloaded = '未加载',
   fail = '加载失败',
   none = ''
}

export function useReferHelper(info: ProjectInfo) {
   const store = useProjectStore()

   function getDetail(r: Partial<ReferItem>): DetailType {
      const loaded = store.packages
      return (r.key! in loaded) ? DetailType.loaded : DetailType.unloaded
   }

   function addRefer(newOne: Partial<ReferItem>) {
      for (const r of info.references) {
         if (r.key === newOne.key) return r
      }
      const tmp = fromRaw(newOne, ReferItem)
      tmp.detail = getDetail(tmp)
      info.references.push(tmp)
      return newOne
   }

   function deleteRefer(item: ReferItem) {
      const target = localList.value.find(x => x.key === item.key)
      if (target) target.selected = true
      info.references = info.references.filter(x => x.key !== item.key)
   }

   function getReferMap() {
      const tmp: Record<string, Reference> = {}
      info.references.forEach((x) => {
         if (x.key) tmp[x.key] = <Reference>({
            name: x.value,
            version: x.version,
            key: x.key,
            url: x.url
         })
      })
      return tmp
   }

   /**
    * 加载全局包，用于显示当前的机器上，在两处位置处的包，可以快速地进行选择依赖
    */
   const globalPackages = useGlobalPackages()
   const localList = ref<Partial<ReferItem>[]>([])
   watch(globalPackages, () => {
      const tmp: Partial<ReferItem>[] = []
      forIn(globalPackages, (key, pkg) => {
         const newOne = pkg2ReferItem(pkg)
         const target = info.references.find(x => newOne.key === x.key)
         newOne.selected = !!target
         tmp.push(newOne)
      })
      localList.value = tmp
   }, { immediate: true })


   return {
      globalPackages,
      localList,
      addRefer,
      deleteRefer,
      getReferMap,
      getDetail
   }
}

/**
 * 将一个Reference对象转化为ReferItem对象
 */
export function refer2ReferItem(x: Reference) {
   const tmp = fromRaw(x, ReferItem)
   tmp.detail = DetailType.loaded
   tmp.value = x.name
   return tmp
}

/**
 * 将一个Package对象转化为
 */
export function pkg2ReferItem(pkg: Package) {
   const tmp = fromRaw(pkg, ReferItem)
   tmp.selected = false
   tmp.value = pkg.name
   return tmp
}


