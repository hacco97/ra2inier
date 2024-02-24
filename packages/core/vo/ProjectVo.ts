import {  IProject } from "../entity/Project"
import { PackageVo } from "./PackageVo"


export interface ProjectVo extends IProject {
   main: string
   packages: Record<string, PackageVo>

   cache: Record<string, string>
   // 记录着IniObeject的翻译后数据，可以减少不必要的翻译
   workspace: string

   path: string
}

