import { fromRaw, PackageDto, ProjectDto, Reference, ToDto, toRaw } from '../';
import { Project } from '../entity/Project';
import { PackageRo } from './PackageRo';

export type { ProjectVo } from '../vo/ProjectVo';

export class ProjectRo extends Project implements ToDto {
   [key: string]: any

   /**
    * 项目已经加载
    */
   loaded: boolean = false
   /**
    * 项目正在加载
    */
   loading: boolean = false
   /**
    * 项目当前可以被加载
    */
   get loadable() { return !this.loaded && !this.loading }
   /**
    * 项目的主包
    */
   main?: PackageRo
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
      const main = project.main!
      this.name = project.name || '(unknown name)'
      this.author = main.author || '(unknown author)'
      this.target = main.target
      this.references = toRaw(main.references)
   }
}
