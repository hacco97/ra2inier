import { Project } from '../entity/Project';
import { PackageVo } from './PackageVo';

export interface ProjectVo extends Project {
   /**
    * 主包的key值
    */
   main: string
   packages: Record<string, PackageVo>

   cache: Record<string, string>
   // 记录着IniObeject的翻译后数据，可以减少不必要的翻译
   workspace: string

   path: string

   isEmpty: boolean
}

export class EMPTY_PROJECTVO implements Partial<ProjectVo> {
   name = ''
   author = ''
   cache = {}
   path = ''
   workspace = ''
   main = ''
   packages = {}
   remote = {}
   isEmpty = true
}

