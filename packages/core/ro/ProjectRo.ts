import { PackageDto, ProjectDto, ToDto } from '../dto';
import { Project } from '../entity/Project';
import { fromRaw } from '../utils/object';
import { PackageRo } from './PackageRo';

export class ProjectRo extends Project implements ToDto {
   [key: string]: any

   /**
    * 项目的主包
    */
   main: PackageRo = new PackageRo
   /**
    * 项目的所有包，包括主包
    */
   packages: Record<string, PackageRo> = {}
   /**
    * 获得主包的引用
    */
   get references() { return this.main ? this.main.references : {} }

   toDto() {
      const d = fromRaw(this, ProjectDto)
      d.main = fromRaw(this.main || {}, PackageDto)
      return <ToDto>d
   }
}
