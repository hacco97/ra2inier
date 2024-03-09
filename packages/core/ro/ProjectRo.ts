import { fromRaw, PackageDto, ProjectDto, Reference, ToDto } from '../';
import { Project } from '../entity/Project';
import { PackageRo } from './PackageRo';

export type { ProjectVo } from '../vo/ProjectVo';

export class ProjectRo extends Project implements ToDto {
   [key: string]: any

   // 项目已经加载
   loaded: boolean = false
   // 项目正在加载
   loading: boolean = false

   get loadable() { return !this.loaded && !this.loading }

   main?: PackageRo

   packages: Record<string, PackageRo> = {}

   get references() { return this.main ? this.main.references : [] }

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
   references: Reference[] = []

   constructor(project?: ProjectRo) {
      if (!project) return
      const main = project.main!
      this.name = project.name
      this.author = main.author
      this.target = main.target
      this.references = main.references.map((key) => {
         return new Reference(project.packages[key])
      })
   }
}
