import fs from 'node:fs';

import { component, inject } from '~/mainWindow/ioc.config';

import {
  enhance, fromRaw, isEmptyObject, isUniqueObject, Package,
  Project, ProjectVo,
} from '@ra2inier/core';
import {
  escapePath, readJson, writeFile, writeJson,
} from '@ra2inier/core/node';

import { DaoConfig } from './DaoConfig';
import { PackageDao } from './PackageDao';

@component('project-dao')
export class ProjectDao {

   // 项目的文件路径
   #path = ''
   // 主包的键值
   #main = ''

   // 缓存，包key值：包的文件路径
   #packages: Record<string, Package> = {}

   get path() { return this.#path }
   get main() { return this.#main }
   get mainPkg() { return this.#packages[this.#main] }
   get isConnected() { return !!this.#path }

   @inject('dao-config') declare config: DaoConfig
   @inject('package-dao') declare packageDao: PackageDao

   // 连接至
   connectToProject(projectPath: string) {
      if (!this.checkPath(projectPath)) return false
      if (projectPath === this.#path) return true
      this.#path = projectPath
      this.#main = ''
      this.#packages = {}
      return true
   }

   checkPath(path: string) {
      path = escapePath(path, this.config.PROJECT_INFO_FILE)
      if (!fs.existsSync(path)) return false
      const json = readJson(path)
      return isUniqueObject(json)
   }

   /**
    * 读取项目的info文件
    */
   readProjectInfo(path?: string) {
      const projectPath = path || this.#path
      // 返回项目的info文件信息
      const projectInfoFile = escapePath(projectPath, this.config.PROJECT_INFO_FILE)
      const project = fromRaw(readJson(projectInfoFile), Project)
      this.readPackagesList()

      // TODO: 添加更多project的属性

      return project
   }

   private readPackagesList() {
      if (!isEmptyObject(this.#packages)) return this.#packages
      if (!this.isConnected) throw Error('需要先打开项目，才能获得packages')
      const projectPath = this.#path
      // 读取主包
      const mainPkg = this.packageDao.readPackageInfoByPath(projectPath)!
      this.#main = mainPkg.key
      const references = this.packageDao.resolveReferences(projectPath)
      return this.#packages = {
         [mainPkg.key]: mainPkg,
         ...references
      }
   }

   /**
    * 为一个包添加一个引用
    */
   addReference(referPath: string) {
      const refer = this.packageDao.readPackageInfoByPath(referPath)
      if (!refer) return undefined
      this.#packages[refer.path] = refer

   }

   resolveProjectVo(project: Project): ProjectVo {
      const projectVo: ProjectVo = enhance(project, {
         cache: {},
         path: this.path,
         workspace: '',
         main: this.main,
         packages: {},
      })
      // 读取并装载每个package的属性

      const pkgs = this.readPackagesList()
      projectVo.main = this.main
      for (const key in pkgs) {
         const pkg = this.packageDao.readPackageByPath(pkgs[key].path)
         pkg && (projectVo.packages[key] = pkg)
      }
      return projectVo
   }

   writeBuildResult(path: string, result: any) {
      // if (fs.existsSync(path)) throw Error('目标文件已经存在')
      writeFile(path, result)
      return true
   }


   writeProjectInfo(project: Project, path?: string,) {
      const projectPath = path || this.#path
      const infoPath = escapePath(projectPath, this.config.PROJECT_INFO_FILE)
      writeJson(infoPath, project)
   }


}
