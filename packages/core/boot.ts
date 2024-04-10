import { IniObjectRo } from './ro/IniObejctRo'
import { MapperRo } from './ro/MapperRo'
import { PackageRo } from './ro/PackageRo'
import { ProjectRo } from './ro/ProjectRo'
import { ScopeRo } from './ro/ScopeRo'
import { WordRo } from './ro/WordRo'
import { forIn, fromRaw } from './utils/object'
import { IniObjectVo, MapperVo, ScopeVo, WordVo } from './vo/ObjectVo'
import { PackageVo } from './vo/PackageVo'
import { ProjectVo } from './vo/ProjectVo'

export * from './dto'
export * from './entity'
export * from './ro'
export * from './utils'
export * from './vo'

/**
 * 创建一个项目的全部资源文件集合
 */
export function createAll() {
   /**
    * 全局对象集合
    */
   const objects: Record<string, IniObjectRo> = {}
   /**
    * 全局scopes集合
    */
   const scopes: Record<string, ScopeRo> = {}
   /**
    * 全局mappers集合
    */
   const mappers: Record<string, MapperRo> = {}
   /**
    * 全局字典集合
    */
   const dictionary: Record<string, WordRo> = {}


   return {
      objects,
      scopes,
      mappers,
      dictionary,
      main: new PackageRo
   }
}

export type AllType = ReturnType<typeof createAll>
export type AllTypeKey = keyof ReturnType<typeof createAll>


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
export function parsePackages(pkgsVo: Record<string, PackageVo>) {
   const pkgs: Record<string, PackageRo> = {}
   // 处理后端的数据，将iniObejct Vo转化为Ro对象，
   for (const key in pkgsVo) {
      const vo = pkgsVo[key]
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
      pkgs[key] = tmp
   }
   return pkgs
}

/**
 * 从vo对象创建一个ro对象
 */
export function createProjectRo(vo: ProjectVo) {
   const ro = new ProjectRo()
   vo.isEmpty && (ro.isEmpty = vo.isEmpty)
   ro.packages = parsePackages(vo.packages)
   const main = ro.main = ro.packages[vo.main] || new PackageRo('')
   ro.cache = vo.cache
   ro.buildConfig = vo.buildConfig || {}
   ro.referPathMap = vo.referPathMap || {}
   ro.name = main.name
   return ro
}
