
import { Package } from '../entity/Package';
import { IniObjectRo } from './IniObejctRo';
import { ScopeRo } from './ScopeRo';
import { MapperRo } from './MapperRo';
import { WordRo } from './WordRo';
import { ResourceRo } from './ResourseRo';


export class PackageRo extends Package {
   // ini 对象
   objects: Record<string, IniObjectRo> = {}
   resources: Record<string, ResourceRo> = {}        // 后加载
   extras: Record<string, ResourceRo> = {}           // 后加载

   // 元数据
   scopes: Record<string, ScopeRo> = {}
   mappers: Record<string, MapperRo> = {}           // 后加载
   dictionary: Record<string, WordRo> = {}              // 后加载
}
