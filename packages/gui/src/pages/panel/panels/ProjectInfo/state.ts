import { useGlobalPackages } from '@/stores/staticStore';
import { ref, watch } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { PackageRo, ProjectRo, Reference, forIn, toRaw } from "@ra2inier/core"
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
      this.name = project.name || '(unknown name)'
      this.author = main.author || '(unknown author)'
      this.target = main.target
      this.references = []
      for (let r of Object.values(main.references)) {
         this.references.push(refer2ReferItem(r))
      }
   }
}

export class ReferItem implements IItem {
   /**
    * 包名
    */
   name: string = ''
   /**
    * 包的本地路径
    */
   path: string = ''
   /**
    * 包的键值
    */
   key: string = ''
   /**
    * 包的远程地址
    */
   url = ''
   /**
    * 依赖的版本
    */
   version = 0
   /**
 * 列表项目的显示值
 */
   value: string = ''
   /**
    * 列表项是否被选中
    */
   selected: boolean = false
   /**
    * 列表项中的细节
    * 显示当前项目的依赖项
    * 依赖项可以分为两种形态，已经加载的和未加载的
    * 未加载的包为虚悬依赖，实际上当前内存中没有该包的数据，不能够参与当前项目的构建
    */
   detail: string = ''
}

export function useReferHelper(info: ProjectInfo) {
   const store = useProjectStore()

   function getDetail(r: Partial<ReferItem>) {
      const loaded = store.packages
      return (r.key! in loaded) ? '已加载' : '未加载'
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
            path: x.path,
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
   tmp.detail = '已加载'
   tmp.value = x.name
   return fromRaw(x, ReferItem)
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


