import fs from 'node:fs';

import { component, inject } from '~/mainWindow/ioc.config';

import {
   Config,
   EMPTY_PACKAGEVO,
   EMPTY_PROJECTVO,
   enhance, fromRaw, isUniqueObject, Package,
   PackageVo,
   Project, ProjectVo, Reference, UniqueObject,
} from '@ra2inier/core';
import {
   escapePath, readJson, writeFile, writeJson,
} from '@ra2inier/core/node';

import { DaoConfig } from './DaoConfig';
import { PackageDao } from './PackageDao';
import { StaticDao } from './StaticDao';

@component('project-dao')
export class ProjectDao {
   @inject('dao-config') declare config: DaoConfig
   @inject('app-config') declare appConfig: Config
   @inject('package-dao') declare packageDao: PackageDao
   @inject('static-dao') declare staticDao: StaticDao

   checkPath(path: string) {
      path = escapePath(path, this.config.PROJECT_INFO_FILE)
      if (!fs.existsSync(path)) return false
      const json = readJson(path)
      return isUniqueObject(json)
   }

   /**
    * 读取项目的info文件
    */
   readProjectInfo(projectPath: string) {
      // 返回项目的info文件信息
      const projectInfoFile = escapePath(projectPath, this.config.PROJECT_INFO_FILE)
      const project = fromRaw(readJson(projectInfoFile), Project)
      // TODO: 添加更多属性
      return project
   }

   /**
    * 读取项目的所有资源文件，创建一个Vo对象
    */
   resolveProjectVo(project: Project, projectPath: string): ProjectVo {
      const projectVo: ProjectVo = enhance(project, new EMPTY_PROJECTVO)
      // 读取并装载每个package的属性
      let main = this.packageDao.readPackageByPath(projectPath)
      if (!main) main = enhance<PackageVo>(new Package, new EMPTY_PACKAGEVO)
      projectVo.main = UniqueObject.getKey(main)
      projectVo.path = projectPath

      const [refers, remote] = this.resolveReferences(main)
      for (const referPkg of Object.values(refers)) {
         const pkg = this.packageDao.readPackageByPath(referPkg.path)
         pkg && (projectVo.packages[referPkg.key] = pkg)
      }
      projectVo.remote = remote
      return projectVo
   }

   /**
    * 从本地读取一个package的全部引用，包括引用的引用
    */
   resolveReferences(pkg: Package) {
      const globalPackages = this.staticDao.readGlobalPackages()
      const references: Record<string, Package> = {
         [UniqueObject.getKey(pkg)]: pkg
      }
      const remote: Record<string, Reference> = {}
      function dfs(pkg: Package) {
         for (const refer of pkg.references) {
            // 尝试从本地读取
            if (refer.key in references) continue
            if (refer.key in globalPackages) {
               const newPkg = references[refer.key] = globalPackages[refer.key]
               dfs(newPkg)
               continue
            }
            // 尝试从远程获取
            if (refer.url && refer.key) remote[refer.key] = refer
         }
      }
      dfs(pkg)
      return [references, remote] as const
   }

   /**
    * 为一个包添加一个引用
    */
   addReference(referPath: string) {
      const refer = this.packageDao.readPackageInfoByPath(referPath)
      if (!refer) return undefined
      // this.#packages[refer.path] = refer
   }


   writeBuildResult(path: string, result: any) {
      // if (fs.existsSync(path)) throw Error('目标文件已经存在')
      writeFile(path, result)
      return true
   }


   writeProjectInfoByPath(project: Project, projectPath: string,) {
      const infoPath = escapePath(projectPath, this.config.PROJECT_INFO_FILE)
      writeJson(infoPath, project)
   }
}
