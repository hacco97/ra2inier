import fs from 'node:fs';

import { component, inject } from '~/mainWindow/ioc.config';

import {
  enhance, fromRaw, isUniqueObject, Package, Project,
  ProjectVo,
} from '@ra2inier/core';
import { escapePath, readJson, writeFile } from '@ra2inier/core/node';

import { DaoConfig } from './DaoConfig';
import { PackageDao } from './PackageDao';

@component('project-dao')
export class ProjectDao {

   // 项目的文件路径
   #path = ''
   // 主包的键值
   #main = ''
   // 包key值：包的文件路径
   #packages?: Record<string, Package>

   get path() { return this.#path }
   get main() { return this.#main }
   get mainPkg() { return this.#packages ? this.#packages[this.#main] : undefined }
   get isConnected() { return !!this.#path }

   @inject('dao-config') declare config: DaoConfig
   @inject('package-dao') declare packageDao: PackageDao

   // 连接至
   connectToProject(projectPath: string) {
      if (!this.checkPath(projectPath)) return false
      if (projectPath === this.#path) return true
      this.#path = projectPath
      this.#main = ''
      this.#packages = undefined
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

   readPackagesList() {
      if (this.#packages) return this.#packages
      if (!this.isConnected) throw Error('需要先打开项目，才能获得packages')
      const projectPath = this.#path
      // 读取主包
      const mainPkg = this.packageDao.readPackageInfoByPath(projectPath)!
      this.#main = mainPkg.key
      const references = this.resolveReferences(projectPath)
      const set = new Set(mainPkg.references.map((ref) => ref.split('\n')[0]))
      // forIn(references, (key) => {
      //    if (set.has(key)) return
      //    delete references[key]
      // })
      return this.#packages = {
         [mainPkg.key]: mainPkg,
         ...references
      }
   }

   resolveReferences(pkgPath: string) {
      // 读取packages目录
      const referPath = escapePath(pkgPath, this.config.REFERENCE_DIR)
      // 读取引用的包
      const references: Record<string, Package> = {}
      for (const name of fs.readdirSync(referPath)) {
         const pkgPath = escapePath(referPath, name)
         const pkg = this.packageDao.readPackageInfoByPath(pkgPath)
         pkg && (references[pkg.key] = pkg)
      }
      return references
   }


   resolveInfoToVo(project: Project): ProjectVo {
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
}
