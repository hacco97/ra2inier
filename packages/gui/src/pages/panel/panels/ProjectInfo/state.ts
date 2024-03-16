import { IItem } from '@/components/ListViewState';
import { projectInfo as info } from '@/stores/projectStore';
import { useGlobalPackages } from '@/stores/staticStore';
import { forIn, Package, Reference } from '@ra2inier/core';
import { defaultApp } from 'process';
import { ref, watch } from 'vue';

export interface ReferItem extends IItem, Reference {
   path: string,
   key: string,
   missing: boolean
   unknown: boolean
}

export function useReferList() {
   /**
    * 当前依赖项
    */
   const referList = ref<Partial<ReferItem>[]>([])

   watch(info, () => {
      referList.value = Object.values(info.value.references).map(refer2ReferItem)
   }, { immediate: true })


   function addRefer(newOne: Partial<ReferItem>) {
      for (const r of referList.value) {
         if (r.key === newOne.key) return r
      }
      referList.value.push(newOne)
      return newOne
   }

   /**
    * 全局包
    */
   const globalPackages = useGlobalPackages()
   const localList = ref<Partial<ReferItem>[]>([])
   watch(globalPackages, () => {
      const tmp: Partial<ReferItem>[] = []
      forIn(globalPackages, (key, pkg) => tmp.push(pkg2Item(pkg)))
      localList.value = tmp
   }, { immediate: true })


   function onReferDelete(item: IItem, order: number) {
      const i = <ReferItem>item
      const target = localList.value.find(x => x.key === i.key)
      if (target) target.selected = false
      referList.value = referList.value.filter(x => x.key !== item.key)
   }

   function onLocalSelect(item: IItem, order: number) {
      const target = localList.value.find(x => x.key === item.key)!
      if (item.selected) {
         addRefer(target)
      } else {
         referList.value = referList.value.filter(x => x.key !== item.key)
      }
      target.selected = item.selected
   }

   return {
      referList,
      localList,
      onLocalSelect,
      onReferDelete
   }
}

function createPopup(x: any) {
   const url = `\n仓库链接：<a href="${x.url}" class="link">\
${(x.url && x.url.startsWith('https://github.com')) ? x.url : '?'}</a>`
   return `本地路径：${x.path || '?'}${url}`
}

function refer2ReferItem(x: Reference) {
   let popup = createPopup(x)
   return <ReferItem>{
      value: x.name || '匿名',
      popup,
      path: x.path,
      key: x.key,
      url: x.url,
      get unknown() { return !this.url && !this.path }
   }
}

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
