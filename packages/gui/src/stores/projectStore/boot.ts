import {
   copy, createProject, IniObjectRo, MapperRo, PackageRo, Reference, ScopeRo,
   WordRo,
} from '@ra2inier/core';
import { ref, shallowReadonly } from 'vue';

export const project = createProject()


let tmp: Record<string, any> = {}
function getReadonlyTmp<T extends ValueSetKey>(type: T) {
   if (!tmp[type]) tmp[type] = shallowReadonly(project.main![type])
   return <Readonly<Record<string, ValueSetType[T]>>>tmp[type]
}
export const allOfMain = {
   get objects() { return getReadonlyTmp('objects') },
   get dictionary() { return getReadonlyTmp('dictionary') },
   get mappers() { return getReadonlyTmp('mappers') },
   get scopes() { return getReadonlyTmp('scopes') },
}

export type ValueSetType = {
   objects: IniObjectRo
   dictionary: WordRo
   mappers: MapperRo
   scopes: ScopeRo
}
export type ValueSetKey = keyof ValueSetType

/**
 * 修改主包中的对象
 */
export function setValue<V extends ValueSetKey, T extends ValueSetType[V]>(type: V, key: string, value?: T) {
   const tmp = project.main![type][key]
   if (!value) {
      delete project.main![type][key]
   } else {
      project.main![type][key] = value
   }
   return tmp as T
}

export function setPackage(key: string, pkg?: PackageRo) {
   if(key===mainKey()) return
   if (pkg) { project.packages[key] = pkg }
   else delete project.packages[key]
}

export function clearAll() {
   copy(createProject(), project)
}

export function mainKey() {
   return project.main ? project.main.key : ''
}

export function setReference(key: string, refer?: Reference) {
   if (!project.main) return
   if (refer) project.main.references[key] = refer
   else delete project.main.references[key]
}
