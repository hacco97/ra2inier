import {
  All, createAll, IniObjectRo, MapperRo, PackageRo,
  ScopeRo, WordRo,
} from '@ra2inier/core';

const all = createAll()

export const {
   objects,
   scopes,
   mappers,
   dictionary,
   main
} = {
   objects: <Readonly<Record<string, IniObjectRo>>>all.objects,
   scopes: <Readonly<Record<string, ScopeRo>>>all.scopes,
   mappers: <Readonly<Record<string, MapperRo>>>all.mappers,
   dictionary: <Readonly<Record<string, WordRo>>>all.dictionary,
   main: <Readonly<Record<string, PackageRo>>>all.main,
}

export default <Readonly<All>>all

export function setObject(key: string, obejct: IniObjectRo) {
   // @ts-ignore
   objects[key] = obejct
}

export function setWord(key: string, word: WordRo) {
   // @ts-ignore
   dictionary[key] = word
}

export function setScope(key: string, scope: ScopeRo) {
   // @ts-ignore
   scopes[key] = scope
}

export function setMapper(key: string, mapper: MapperRo) {
   // @ts-ignore
   mappers[key] = mapper
}


export function clearAll() {
   // @ts-ignore
   for (const key in objects) delete objects[key]
   // @ts-ignore
   for (const key in scopes) delete scopes[key]
   // @ts-ignore
   for (const key in mappers) delete mappers[key]
   // @ts-ignore
   for (const key in dictionary) delete dictionary[key]
}
