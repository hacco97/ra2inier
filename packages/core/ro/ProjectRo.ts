import { PackageDto, ProjectDto, ToDto } from '../dto';
import { Reference } from '../entity/Package';
import { Project } from '../entity/Project';
import { fromRaw, toRaw } from '../utils/object';
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

export class ProjectInfo {
   name = ''
   author = ''
   target = ''
   references: Record<string, Reference> = {}

   constructor(project?: ProjectRo) {
      if (!project) return
      const main = project.main || new PackageRo
      this.name = project.name || '(unknown name)'
      this.author = main.author || '(unknown author)'
      this.target = main.target
      this.references = toRaw(main.references)
   }
}
