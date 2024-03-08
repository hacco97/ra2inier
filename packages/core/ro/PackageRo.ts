import { fromRaw, PackageDto } from '../';
import { ToDto } from '../dto';
import { Package } from '../entity/Package';
import { IniObjectRo } from './IniObejctRo';
import { MapperRo } from './MapperRo';
import { ResourceRo } from './ResourseRo';
import { ScopeRo } from './ScopeRo';
import { WordRo } from './WordRo';

export class PackageRo extends Package implements ToDto {
   // ini 对象
   objects: Record<string, IniObjectRo> = {}
   resources: Record<string, ResourceRo> = {}        // 后加载
   extras: Record<string, ResourceRo> = {}           // 后加载

   // 元数据
   scopes: Record<string, ScopeRo> = {}
   mappers: Record<string, MapperRo> = {}           // 后加载
   dictionary: Record<string, WordRo> = {}              // 后加载

   toDto() {
      return <ToDto>fromRaw(this, PackageDto)
   }
}
