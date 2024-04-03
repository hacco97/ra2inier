import { useLogger } from '@/boot/logger';
import {
   createProjectRo, EMPTY_PROJECTVO, forIn, IniObjectRo, MapperRo, PackageRo,
   PackageVo, parsePackages, ProjectVo, Reference, ScopeRo, WordRo,
} from '@ra2inier/core';
import { computed, reactive, shallowReactive } from 'vue';

/**
 * 创建一个项目初始化值
 */
export function createProject(projectVo: ProjectVo) {
   /**
    * 核心project对象
    */
   const project = reactive(createProjectRo(projectVo))
   /**
    * 主包对象
    */
   const main = computed(() => project.main || new PackageRo)
   const mainKey = computed(() => project.main?.key || '')

   /**
    * 修改主包中的对象
    */
   function setValue<V extends ValueSetKey, T extends ValueSetType[V]>(type: V, key: string, value?: T) {
      const tmp = main.value![type][key]
      if (!value) {
         delete main.value![type][key]
      } else {
         main.value![type][key] = value
      }
      return tmp as T
   }

   function setPackage(key: string, pkg?: PackageRo) {
      if (key === mainKey.value) return
      if (pkg) { project.packages[key] = shallowReactive(pkg) }
      else delete project.packages[key]
   }

   function setReference(key: string, refer?: Reference) {
      if (!main.value) return
      if (refer) main.value.references[key] = refer
      else delete main.value.references[key]
   }

   /**
    * 在已经加载的包中，将不再需要的包移除，找出还没有加载的包
    * @returns [toAdd, toDel] - packages to add and removed packages' keys
    */
   function diffReference(references: Record<string, Reference>) {
      // 删去多余的包
      const toDel = []
      const pkgs = project.packages
      for (const key in pkgs) {
         if (key in references) continue
         setPackage(key, undefined)
         setReference(key, undefined)
         toDel.push(key)
      }
      // work('package/remove', toDel)
      // 确定未加载的包
      const toAdd: Reference[] = []
      for (const key in references) {
         setReference(key, references[key])
         if (key in pkgs) continue
         toAdd.push(references[key])
      }
      return [toAdd, toDel] as const
   }

   /**
    * 向当前项目资源集合中添加新的资源集合
    */
   function mergePackages(pkgs: Record<string, PackageVo>) {
      const parsed = parsePackages(pkgs)
      forIn(parsed, (key, pkg) => {
         setPackage(key, pkg)
         setReference(key, new Reference(pkg))
      })
   }

   return {
      project,
      main,
      mainKey,
      setValue,
      setPackage,
      setReference,
      diffReference,
      mergePackages
   }
}

export type ProjectBoot = ReturnType<typeof createProject>

/**
 * 资源集合的名字键值
 */
export type ValueSetType = {
   objects: IniObjectRo
   dictionary: WordRo
   mappers: MapperRo
   scopes: ScopeRo
}

/**
 * 资源集合的名字键值
 */
export type ValueSetKey = keyof ValueSetType

export const EMPTY_BOOT = createProject(new EMPTY_PROJECTVO)
const logger = useLogger('no project')
export const EMPTY_METHOD = () => {
   logger.warn('请打开一个项目')
   throw Error('请打开一个项目')
}

export function createEmpty<K extends (...args: any) => any>(factory: K) {
   const EMPTY_DERIVED: Record<string, any> = factory(EMPTY_BOOT)
   for (const key in EMPTY_DERIVED) {
      const tmp = EMPTY_DERIVED[key]
      if (typeof tmp === 'function')
         EMPTY_DERIVED[key] = EMPTY_METHOD
   }
   return <ReturnType<K>>EMPTY_DERIVED
}

