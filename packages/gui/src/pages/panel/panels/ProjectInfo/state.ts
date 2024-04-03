import { useGlobalPackages } from '@/stores/staticStore';
import { ProjectInfo, Reference, forIn, toRaw } from '@ra2inier/core';
import { ComputedRef, ref, watch } from 'vue';
import { ReferItem, pkg2ReferItem, refer2ReferItem } from './utils';
import { useProjectStore } from '@/stores/projectStore';

export * from './utils'

export function createReferList(info: ComputedRef<ProjectInfo>) {
   /**
    * 显示当前项目的依赖项
    * 依赖项可以分为两种形态，已经加载的和未加载的
    * 未加载的包为虚悬依赖，实际上当前内存中没有该包的数据，不能够参与当前项目的构建
    */
   const referList = ref<Partial<ReferItem>[]>([])
   watch(() => info.value, () => {
      console.log(info.value)

      referList.value = Object.values(info.value.references).map(refer2ReferItem)
      for (const r of referList.value) {
         r.detail = getDetail(r)
      }
   }, { immediate: true })

   const store = useProjectStore()

   function getDetail(r: Partial<ReferItem>) {
      const loaded = store.packages
      return (r.key! in loaded) ? '已加载' : '未加载'
   }

   function addRefer(newOne: Partial<ReferItem>) {
      for (const r of referList.value) {
         if (r.key === newOne.key) return r
      }
      const tmp = toRaw(newOne)
      tmp.detail = getDetail(tmp)
      referList.value.push(tmp)
      return newOne
   }

   function deleteRefer(item: ReferItem) {
      const target = localList.value.find(x => x.key === item.key)
      if (target) target.selected = true
      referList.value = referList.value.filter(x => x.key !== item.key)
   }

   function getReferMap() {
      const tmp: Record<string, Reference> = {}
      referList.value.forEach((x) => {
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
         const target = referList.value.find(x => newOne.key === x.key)
         newOne.selected = !!target
         tmp.push(newOne)
      })
      localList.value = tmp
   }, { immediate: true })


   return {
      referList,
      localList,
      addRefer,
      deleteRefer,
      globalPackages,
      getReferMap
   }
}



