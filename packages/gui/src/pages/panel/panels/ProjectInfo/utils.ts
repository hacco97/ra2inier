
import { IItem } from '@/components/ListViewState';
import { Package, Reference } from '@ra2inier/core';


export interface ReferItem extends IItem, Reference {
   path: string,
   key: string,
}

export function createPopup(x: Partial<ReferItem>) {
   const path = `本地路径：<file-link style="height: fit-content;" path="${x.path}" class="link">${x.path || '?'}</file-link>`
   const url = `仓库链接：<a href="${x.url}" class="link">${(x.url && x.url.startsWith('https://github.com')) ? x.url : '?'}</a>`
   return `${path}\n${url}`
}

/**
 * 将一个Reference对象转化为ReferItem对象
 */
export function refer2ReferItem(x: Reference) {
   return <ReferItem>{
      value: x.name || '匿名',
      popup: createPopup(x),
      path: x.path,
      key: x.key,
      url: x.url,
      detail: '已加载'
   }
}

/**
 * 将一个Package对象转化为
 */
export function pkg2ReferItem(pkg: Package) {
   return {
      value: pkg.name,
      popup: createPopup({ path: pkg.path }),
      selected: false,
      path: pkg.path,
      key: pkg.key,
      url: pkg.link
   }
}
