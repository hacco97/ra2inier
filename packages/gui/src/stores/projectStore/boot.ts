import {
  copy, createProject, IniObjectRo, MapperRo, ScopeRo,
  WordRo,
} from '@ra2inier/core';

export const project = createProject()

export const all = {
   get objects() { return project.main!.objects },
   get dictionary() { return project.main!.dictionary },
   get mappers() { return project.main!.mappers },
   get scopes() { return project.main!.scopes },
}

export type ValueSetType = {
   objects: IniObjectRo;
   dictionary: WordRo;
   mappers: MapperRo;
   scopes: ScopeRo
};
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


export function clearAll() {
   copy(createProject(), project)
}

export function mainKey() {
   return project.main ? project.main.key : ''
}
