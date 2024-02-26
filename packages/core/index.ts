import {
  createAll, forIn, fromRaw, IniObjectRo, IniObjectVo,
  MapperRo, MapperVo, PackageRo, ProjectRo, ProjectVo,
  ScopeRo, ScopeVo, WordRo, WordVo,
} from './boot';

export * from './boot'
export * from './build'

export type All = ReturnType<typeof createAll>


/**
* 将一个对象中的IniObjectVo加入到objects集合中
*/
export function mergeObjects(objectMap: Record<string, IniObjectVo>, pkgKey: string, objects?: Record<string, IniObjectRo>) {
   const tmp: Record<string, IniObjectRo> = {}
   for (const key in objectMap) {
      const obj = fromRaw(objectMap[key], IniObjectRo)
      obj.package = pkgKey
      tmp[obj.key] = obj
      objects && (objects[obj.key] = obj)
   }
   return tmp
}

/**
 * 将一个对象的ScopeVo加入到scopes中
 */
export function mergeScopes(scopesVo: Record<string, ScopeVo>, pkgKey: string, scopes?: Record<string, ScopeRo>) {
   const tmp: Record<string, ScopeRo> = {}
   forIn(scopesVo, (key, val) => {
      const scope = fromRaw(val, ScopeRo)
      scope.package = pkgKey
      tmp[scope.key] = scope
      scopes && (scopes[scope.key] = scope)
   })
   return tmp
}

/**
 * 将一个对象的MapperVo加入到mappers中
 */
export function mergeMappers(mappersVo: Record<string, MapperVo>, pkgKey: string, mappers?: Record<string, MapperRo>) {
   const tmp: Record<string, MapperRo> = {}
   forIn(mappersVo, (key, val) => {
      const mapper = fromRaw(val, MapperRo)
      mapper.package = pkgKey
      tmp[mapper.key] = mapper
      mappers && (mappers[mapper.key] = mapper)
   })
   return tmp
}

/**
 * 将一个对象的Word加入到了dictionary中
 */
export function mergeWords(words: Record<string, WordVo>, pkgKey: string, dictionary?: Record<string, WordRo>) {
   const tmp: Record<string, WordRo> = {}
   forIn(words, (key, val) => {
      const word = fromRaw(val, WordRo)
      word.package = pkgKey
      tmp[word.key] = word
      dictionary && (dictionary[word.key] = word)
   })
   return tmp
}


/**
 * 打开项目的核心逻辑
 */
export function parseProjectVo(data: ProjectVo, project: ProjectRo) {
   // 处理后端的数据，将iniObejct Vo转化为Ro对象，
   for (const key in data.packages) {
      const vo = data.packages[key]
      const tmp = fromRaw(vo, PackageRo)
      const pkgKey = tmp.key
      // 处理objects的内容
      tmp.objects = mergeObjects(vo.objects, pkgKey)
      //  处理word的内容
      tmp.dictionary = mergeWords(vo.dictionary, pkgKey)
      // 处理scope
      tmp.scopes = mergeScopes(vo.scopes, pkgKey)
      //处理mappers
      tmp.mappers = mergeMappers(vo.mappers, pkgKey)
      project.packages[key] = tmp
   }
   project.main = project.packages[data.main]
}


/**
 * 初始化项目数据，在worker中调用
 */
export function initProject() {

}
