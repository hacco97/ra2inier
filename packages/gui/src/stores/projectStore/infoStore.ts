import { PackageRo, ProjectRo } from '@ra2inier/core';

export class Reference {
   name = ''
   url = ''
   path = ''
   key = ''

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
