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
 * 全局项目对象
 */
export const project: ProjectRo = new ProjectRo
/**
 * 全局对象集合
 */
export const objects: Record<string, IniObjectRo> = {}
/**
 * 全局scopes集合
 */
export const scopes: Record<string, ScopeRo> = {}
/**
 * 全局mappers集合
 */
export const mappers: Record<string, MapperRo> = {}
/**
 * 全局字典集合
 */
export const dictionary: Record<string, WordRo> = {}
const all = {
   project,
   objects,
   scopes,
   mappers,
   dictionary,
   main: new PackageRo
}
export default all
