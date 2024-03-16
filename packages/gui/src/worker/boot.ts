import {
   createAll, IniObjectRo, MapperRo, PackageRo,
   ScopeRo, WordRo, AllType, AllTypeKey
} from '@ra2inier/core';
const all = createAll()
const {
   objects: objects_,
   scopes: scopes_,
   mappers: mappers_,
   dictionary: dictionary_,
   main: main_,
} = all

export const {
   objects,
   scopes,
   mappers,
   dictionary,
   main
} = {
   objects: <Readonly<Record<string, IniObjectRo>>>objects_,
   scopes: <Readonly<Record<string, ScopeRo>>>scopes_,
   mappers: <Readonly<Record<string, MapperRo>>>mappers_,
   dictionary: <Readonly<Record<string, WordRo>>>dictionary_,
   main: <Readonly<Record<string, PackageRo>>>main_,
}

export default <Readonly<AllType>>all

export function setValue<T extends AllTypeKey>(type: T, key: string, data: AllType[T]) {
   all[type][key] = data
}

export function setObject(key: string, obejct: IniObjectRo) {
   objects_[key] = obejct
}

export function setWord(key: string, word: WordRo) {
   dictionary_[key] = word
}

export function setScope(key: string, scope: ScopeRo) {
   scopes_[key] = scope
}

export function setMapper(key: string, mapper: MapperRo) {
   mappers_[key] = mapper
}

const types: AllTypeKey[] = ['objects', 'scopes', 'mappers', 'dictionary']

export function clearAll() {
   for (const type of types)
      for (const key in all[type]) delete all[type][key]
}

export function clearAllByPkgKey(pkgKey: string) {
   for (const type of types)
      for (const key in all[type])
         if (all[type][key].package === pkgKey)
            delete all[type][key]
}
