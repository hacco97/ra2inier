import { component } from '~/mainWindow/ioc.config';

@component('dao-config')
export class DaoConfig {



   // 项目的信息文件
   PROJECT_INFO_FILE = 'project.json'
   // package配置文件的名称
   PACKAGE_INFO_FILE = 'info.json'
   // package统计文件的名称
   PACKAGE_STAT_FILE = 'stat.json'
   // package下的存储IniObject对象的文件夹
   OBJECT_DIR = 'obj'
   // scope文件的位置
   SCOPE_FILE = 'meta/scopes.json'
   // 项目dict字典位置
   DICT_DIR = 'dict'
   // dict word info文件
   WORD_INFO_FILE = 'info.json'
   WORD_DETAIL_FILE = 'detail.md'
   WORD_HOOK_FILE = 'hook.js'
   // 项目mapper的位置
   MAPPER_DIR = 'meta'
   MAPPER_FILE = 'mappers.json'
   // 项目的缓存文件的位置
   CACHE_DIR = 'cache'
   // 项目的临时工作区位置
   WORKSPACE = 'desk'
   // 其他文件的位置
   OTHER_FILES_DIR = 'extra'

}
