import { IItem, Item } from '@/components/ListViewState';
import { projectInfo as info } from '@/stores/projectStore';
import { useGlobalPackages } from '@/stores/staticStore';
import { forIn, MapIn, Package, Reference } from '@ra2inier/core';
import { Ref, ref, toRaw, watch } from 'vue';

interface Refer extends IItem, Reference {
   path: string,
   key: string
}


export function useReferList() {
   /**
    * 当前依赖项
    */
   const list = ref<Partial<Refer>[]>([])
   const refer2Item = (x: Reference) => ({
      value: x.name,
      popup: createPopup(x),
      path: x.path,
      key: x.key,
      url: x.url
   })
   watch(info, () => {
      list.value = info.value.references.map(refer2Item)
   }, { immediate: true })

   function createPopup(x: any) {
      return `${x.url ? x.url + '\n' : ''}本地路径：${x.path}`
   }
   function addRefer(newOne: Partial<Refer>) {
      for (const r of list.value) {
         if (r.key === newOne.key) return r
      }
      list.value.push(newOne)
      return newOne
   }


   /**
    * 全局包
    */
   const globalPackages = useGlobalPackages()
   const localList = ref<Partial<Refer>[]>([])
   watch([globalPackages], () => {
      const tmp: Partial<Refer>[] = []
      forIn(globalPackages, (key, pkg) => tmp.push(pkg2Item(pkg)))
      localList.value = tmp
   }, { immediate: true })
   function pkg2Item(pkg: Package) {
      return {
         value: pkg.name,
         popup: createPopup({ path: pkg.path }),
         selected: true,
         path: pkg.path,
         key: pkg.key,
         url: pkg.link
      }
   }

   function onReferDelete(item: IItem, order: number) {
      const i = <Refer>item
      const target = localList.value.find(x => x.key === i.key)
      if (target) target.selected = false
      list.value = list.value.filter(x => x.key !== item.key)
   }

   function onLocalSelect(item: IItem, order: number) {
      const target = localList.value.find(x => x.key === item.key)!
      console.log(target)

      if (item.selected) {
         addRefer(target)
      } else {
         list.value = list.value.filter(x => x.key !== item.key)
      }
      target.selected = item.selected
   }


   return {
      list,
      localList,
      onLocalSelect,
      onReferDelete
   }

}
