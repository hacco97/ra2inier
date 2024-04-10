
export class Project {
   /**
    * 构建方案，用户预定义的构建方案，使用于当前项目的本地构建
    */
   buildConfig: Record<string, string> = {}

   /**
    * 保存该项目中一些额外需要引用的本地包
    * 包的key：本地路径
    */
   referPathMap: Record<string, string> = {}

   constructor() {
   }
}


