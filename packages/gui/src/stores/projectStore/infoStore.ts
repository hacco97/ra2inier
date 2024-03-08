import { PackageRo, ProjectRo } from '@ra2inier/core';

export class Reference {
   /**
    * 依赖的包名
    */
   name = ''
   /**
    * 依赖包的键值
    */
   key = ''
   /**
    * 依赖的github仓库
    */
   url = ''
   /**
    * 依赖的本地路径
    */
   path = ''


   constructor(pkg: PackageRo) {
      this.name = pkg.name
      this.key = pkg.key
      this.url = pkg.link
      this.path = pkg.path
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
