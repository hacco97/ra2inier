import { Reference } from '../';
import { Project } from '../entity/Project';
import { PackageRo } from './PackageRo';

export type { ProjectVo } from '../vo/ProjectVo';

export class ProjectRo extends Project {
   [key: string]: any

   // 项目已经加载
   loaded: boolean = false
   // 项目正在加载
   loading: boolean = false

   get loadable() { return !this.loaded && !this.loading }

   main?: PackageRo

   packages: Record<string, PackageRo> = {}

   get references() { return this.main ? this.main.references : [] }
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
