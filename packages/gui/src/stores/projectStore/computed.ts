import { computed, ComputedGetter } from 'vue';
import { forIn, PackageRo, ProjectInfo, Reference, } from '@ra2inier/core';
import { mainKey, project, setPackage, setReference, ValueSetKey, ValueSetType } from './boot';
import { downloadRemotePackage, loadingVersion, loadLocalPackage, openProject } from './actions'
import { work } from '@/boot/apis';

/**
 * 自定义computed，让computed的值依赖于loadingVersion
 */
export function loaderComputed<T>(f: ComputedGetter<T>) {
   return computed((o?: T) => {
      if (project.loadable) openProject()
      const tmp = loadingVersion.value
      void tmp
      return f(o)
   })
}

/**
 * 使用vue包装数据使得数据具有响应性
 */
export const projectName = loaderComputed(() => {
   return project.main ? project.main.name : ''
})

export const mainPackage = loaderComputed(() => {
   return project.main ? project.main : new PackageRo
})

export const referPackages = loaderComputed(() => {
   const refers = { ...project.packages }
   delete refers[mainKey()]
   return refers
})

export const packages = loaderComputed(() => {
   return { ...project.packages }
})

export const projectInfo = loaderComputed(() => {
   return new ProjectInfo(project)
})

/**
 * 通过包的键值获得包名
 */
export const packageNames = loaderComputed(() => {
   const map: Record<string, string> = {}
   forIn(project.packages, (key, pkg) => {
      map[key] = pkg.name
   })
   return map
})

/**
 * 返回全部项目资源的可读集合
 */
export const allOfPackages = loaderComputed(() => {
   return {
      objects: mergeKey(project.packages, 'objects'),
      scopes: mergeKey(project.packages, 'scopes'),
      mappers: mergeKey(project.packages, 'mappers'),
      dictionary: mergeKey(project.packages, 'dictionary')
   }
})
function mergeKey<T extends ValueSetKey>(packages: Record<string, PackageRo>, readKey: T) {
   const tmp: Record<string, any> = {}
   forIn(packages, (key, pkg) => {
      forIn(pkg[<keyof PackageRo>readKey], (key, obj) => {
         tmp[key] = obj
      })
   })
   return <Readonly<Record<string, ValueSetType[T]>>>tmp
}


/**
 * 查找项目中的对象
 */
export function queryObject<T extends ValueSetKey>(type: T,
   filter: (v: ValueSetType[T]) => number, limit = 20) {
   const targetSet = allOfPackages.value[type]
   const ret: [number, any][] = []
   forIn(<Record<string, any>>targetSet, (key, val) => {
      const priority = filter(val)
      if (priority > 0) ret.push([priority, val])
   })
   ret.sort((a, b) => a[0] - b[0])
   const temp = []
   for (let i = 0; i < limit && i < ret.length; ++i) { temp.push(ret[i][1]) }
   return <ValueSetType[T][]>(temp.reverse())
}

