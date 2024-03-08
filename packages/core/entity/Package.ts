import { IUniqueObject, UniqueObject } from './Obejct';

export interface IPackage extends IUniqueObject {
   /**
    * 目标平台，典型值；ra2、yr、mo3、inier
    */
   target: string

   /**
    * 作者   名字 <email> (主页)
    */
   author: string

   /**
    * 依赖包的key
    */
   references: string[]

   /**
    * 项目加载器版本
    */
   loaderVersion: string

   /**
    * 包级别的环境变量
    */
   envVariable: Record<string, string>

   /**
    * 包发布的GitHub链接
    */
   link: string

   /**
    * 包的本地路径
    */
   path: string
}


export interface Package extends IPackage { }
export class Package extends UniqueObject {
   target: string = ''
   author: string = ''
   references: string[] = []
   loaderVersion: string = 'v1'
   envVariable: Record<string, string> = {}
   link: string = ''
   path: string = ''
}
