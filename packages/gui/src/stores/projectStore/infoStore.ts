import { ProjectRo } from "@ra2inier/core"


export class ProjectInfo {
   name = ''
   author = ''
   target = ''
   references: string[] = []

   constructor(project?: ProjectRo) {
      if (!project) return
      const main = project.main!
      this.name = project.name
      this.author = main.author
      this.target = main.target
      this.references = main.references
   }
}
