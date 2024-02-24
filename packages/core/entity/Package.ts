import { IUniqueObject, UniqueObject } from "./Obejct"

export interface IPackage extends IUniqueObject {
   // 目标平台，典型值；ra2、yr、mo3、inier
   target: string

   // 作者   名字 <email> (主页)
   author: string

   // 依赖信息
   references: string[]

   // 项目加载器版本
   loaderVersion: string

   // 环境变量
   envVariable: Record<string, string>
}


export interface Package extends IPackage { }
export class Package extends UniqueObject {
   target: string = ''
   author: string = ''
   references: string[] = []
   loaderVersion: string = 'v1'
   envVariable: Record<string, string> = {}
}
