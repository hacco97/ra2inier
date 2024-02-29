import {
  copy, createProject, IniObjectRo, MapperRo, WordRo,
} from '@ra2inier/core';

export const project = createProject()

export const all = {
   get objects() { return project.main!.objects },
   get dictionary() { return project.main!.dictionary },
   get mappers() { return project.main!.mappers },
   get scopes() { return project.main!.scopes },
}

/**
 * 修改主包中的对象
 */
export function setObject(key: string, object?: IniObjectRo): IniObjectRo | undefined {
   const tmp = project.main!.objects[key]
   if (!object) {
      delete project.main!.objects[key]
   } else {
      project.main!.objects[key] = object
   }
   return tmp
}

/**
 * 修改主包中的输出器
 */
export function setMapper(key: string, mapper?: MapperRo) {
   if (!mapper) {
      delete project.main!.mappers[key]
   } else {
      project.main!.mappers[key] = mapper
   }
}

/**
 * 修改主包中的词条
 */
export function setWord(key: string, word?: WordRo) {
   if (!word) {
      delete project.main!.dictionary[key]
   } else {
      project.main!.dictionary[key] = word
   }
}


export function clearAll() {
   copy(createProject(), project)
}
