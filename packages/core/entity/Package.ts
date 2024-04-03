import { UniqueObject } from './Obejct';

export class Package extends UniqueObject {
   /**
    * 目标平台，典型值；ra2、yr、mo3、inier
    */
   target: string = ''
   /**
    * 作者   名字 <email> (主页)
    */
   author: string = ''
   /**
    * 依赖包的key
    */
   references: Record<string, Reference> = {}
   /**
 * 项目加载器版本
 */
   loaderVersion: string = 'v1'
   /**
  * 包级别的环境变量
  */
   envVariable: Record<string, string> = {}
   /**
 * 包发布的GitHub链接
 */
   link: string = ''
}


const LOADED = Symbol()

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
   /**
    * 依赖的版本
    */
   version = 0;
   /**
    * 是否已经被加载，进前端使用
    */
   [LOADED] = false
   get() { return this[LOADED] }
   set(val: boolean) { this[LOADED] = val }

   constructor(pkg: Package) {
      this.name = pkg.name
      this.key = pkg.key
      this.url = pkg.link
      this.path = pkg.path
      this.version = pkg.version
   }

   toJSON() {
      return [this.name, this.key, this.url, this.version].join('\n')
   }

   static parser(val: string) {
      const ret = val.split('\n')
      return <Reference>{
         name: ret[0],
         key: ret[1],
         url: ret[2],
         version: parseInt(ret[3]),
         path: ''
      }
   }

}
