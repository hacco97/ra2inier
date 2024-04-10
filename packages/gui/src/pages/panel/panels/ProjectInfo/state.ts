import { ProjectInfo } from '@/stores/projectStore';
import { ProjectRo } from "@ra2inier/core"

export function createProjectInfo(project: ProjectRo) {
   const info = new ProjectInfo(project)
   for (const r of info.references) {
      if (r.key in project.packages) {
         r.path = project.packages[r.key].path
      }
   }
   return info
}
