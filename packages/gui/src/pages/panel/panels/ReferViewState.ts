import { ReferItem, useProjectStore } from "@/stores/projectStore"
import { useGlobalPackages } from "@/stores/staticStore"
import { Package, Reference, UniqueObject, forIn, fromRaw } from "@ra2inier/core"
import { reactive, ref, watch } from "vue"


export function useReferViewState(referList: ReferItem[]) {
   const references = reactive(referList.slice(0))
   const store = useProjectStore()

   function getDetail(key: string) {
      const loaded = store.packages
      return (key! in loaded) ? '已加载' : '未加载'
   }

   function addRefer(newOne: Partial<ReferItem>) {
      for (const r of references) {
         if (r.key === newOne.key) return r
      }
      const tmp = fromRaw(newOne, ReferItem)
      // tmp.detail || (tmp.detail = getDetail(tmp.key))
      references.push(tmp)
      return newOne
   }

   function deleteRefer(item: ReferItem) {
      const id = references.findIndex(x => x.key === item.key)
      if (id >= 0) references.splice(id, 1)
   }

   function getReferMap() {
      const tmp: Record<string, (Reference & { path: string })> = {}
      references.forEach((x) => {
         if (x.key) tmp[x.key] = {
            ...fromRaw(x, Reference),
            path: x.path,
            name: x.value
         }
      })
      return tmp
   }
   return {
      references,
      getDetail,
      addRefer,
      deleteRefer,
      getReferMap
   }
}

export type ReferViewState = ReturnType<typeof useReferViewState>

export function useLocalList(referList: ReferItem[]) {
   /**
       * 加载全局包，用于显示当前的机器上，在两处位置处的包，可以快速地进行选择依赖
       */
   const globalPackages = useGlobalPackages()
   const localList = ref<ReferItem[]>([])
   watch(globalPackages, () => {
      const tmp: ReferItem[] = []
      forIn(globalPackages, (key, pkg) => {
         const newOne = pkg2ReferItem(pkg)
         const target = referList.find(x => newOne.key === x.key)
         newOne.selected = !!target
         tmp.push(newOne)
      })
      localList.value = tmp
   }, { immediate: true })

   return localList
}

/**
 * 将一个Package对象转化为ReferItem
 */
export function pkg2ReferItem(pkg: Package) {
   const tmp = fromRaw(pkg, ReferItem)
   tmp.selected = false
   tmp.value = pkg.fullname
   return tmp
}
