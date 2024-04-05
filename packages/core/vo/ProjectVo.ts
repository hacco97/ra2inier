import { Project } from '../entity/Project';
import { PackageVo } from './PackageVo';

export interface ProjectVo extends Project {
   /**
    * 主包的key值
    */
   main: string
   /**
    * 所有的包
    */
   packages: Record<string, PackageVo>
   /**
    * 记录着IniObeject的翻译后数据，可以减少不必要的翻译
    */
   cache: Record<string, string>
   /**
    * 当前的项目路径
    */
   path: string
   /**
    * 特殊标志位，是空项目
    */
   isEmpty: boolean
}

export class EMPTY_PROJECTVO implements Partial<ProjectVo> {
   buildConfig = {}

   cache = {}
   path = ''
   main = ''
   packages = {}
   isEmpty = true
}

