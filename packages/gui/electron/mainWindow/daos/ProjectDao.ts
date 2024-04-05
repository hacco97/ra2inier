import fs from 'node:fs';

import { component, inject } from '~/mainWindow/ioc.config';
import {
   Config, EMPTY_PACKAGEVO, EMPTY_PROJECTVO, enhance, fromRaw, isUniqueObject, Package,
   PackageVo, Project, ProjectVo, UniqueObject,
} from '@ra2inier/core';
import { escapePath, readJson, writeFile, writeJson, } from '@ra2inier/core/node';

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
      // 检查project.json文件
      const projectPath = escapePath(path, this.config.PROJECT_INFO_FILE)
      if (!fs.existsSync(projectPath)) return false

      // 检查info.json文件
      const packagePath = escapePath(path, this.config.PACKAGE_INFO_FILE)
      if (!fs.existsSync(packagePath)) return false
      const json = readJson(packagePath)
      if (!isUniqueObject(json)) return false
      return true
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

      const refers = this.resolveReferences(main)
      for (const referkey in refers) {
         const pkg = this.packageDao.readPackageByPath(refers[referkey].path)
         pkg && (projectVo.packages[referkey] = pkg)
      }
      projectVo.isEmpty = false
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
      function dfs(pkg: Package) {
         for (const key in pkg.references) {
            // 尝试从本地读取
            if (key in references) continue
            if (key in globalPackages) {
               dfs(references[key] = globalPackages[key])
            }
         }
      }
      dfs(pkg)
      return references
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
