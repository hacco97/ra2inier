import {
   IniObjectRo, MapperRo, PackageRo, ProjectRo, ScopeRo,
   WordRo,
} from './ro';

export * from './dto'
export * from './entity'
export * from './ro'
export * from './utils'
export * from './vo'


/**
 * 创建一个项目对象
 */
export function createProject() {
   /**
    * 全局项目对象
    */
   const project: ProjectRo = new ProjectRo

   return project
}

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
