import { exec, send } from '@/boot/apis';
// 菜单栏
import { openProjectFromBrowser, saveProject } from '@/stores/projectStore';

import { addPanel, PanelParam, PanelType } from './panelList';

interface ListItem {
   id: number,
   label: string,
   sub: SubItem[]
}

interface SubItem {
   id: number,
   label?: string,
   component?: string,
   exec?: Function,
   value?: any
}


export const menuList: ListItem[] = [
   {
      id: 0,
      label: '文件',
      sub: [
         {
            id: 0,
            label: '新建项目',
            exec() {
               addPanel(new PanelParam({
                  label: '新建项目',
                  type: PanelType.NewProject,
                  data: 'NewProject'
               }))
            }
         },
         {
            id: 1,
            label: '打开项目',
            component: 'FileBox',
            exec: openProjectFromBrowser,
         },
         {
            id: 2,
            label: '保存项目',
            exec: saveProject
         },
         {
            id: 3,
            label: '导出为包'
         },
         {
            id: 4,
            label: '导入包'
         },
         {
            id: 5,
            label: '项目设置',
            exec() {
               addPanel(new PanelParam({
                  label: '项目设置',
                  type: PanelType.ProjectInfo,
                  data: 'ProjectInfo'
               }))
            }
         },
      ]
   },
   {
      id: 1,
      label: '编辑',
      sub: [
         {
            id: 0,
            label: '复制'
         },
         {
            id: 1,
            label: '粘贴'
         },
         {
            id: 3,
            label: '撤销'
         }
      ]
   },
   {
      id: 2,
      label: '对象',
      sub: [
         {
            id: 0,
            label: '添加'
         },
         {
            id: 1,
            label: '删除'
         },
         {
            id: 3,
            label: '编辑'
         },
         {
            id: 4,
            label: '查找'
         },
      ]
   },
   {
      id: 3,
      label: '视图',
      sub: [
         {
            id: 0,
            label: '项目资源管理器'
         },
         {
            id: 1,
            label: '元对象管理器'
         },
         {
            id: 2,
            label: '素材管理器'
         },
         {
            id: 3,
            label: '内置启动器'
         },
         {
            id: 4,
            label: 'MOD工具箱'
         },
         {
            id: 5,
            label: '教程'
         },
      ]
   },
   {
      id: 4,
      label: '关于',
      sub: [
         {
            id: 0,
            label: '设置',
            exec() {
               addPanel(new PanelParam({
                  label: '设置',
                  type: PanelType.Setting,
                  data: 'project-setting'
               }))
            }
         },
         {
            id: 1,
            label: '首页'
         },
         {
            id: 2,
            label: '帮助'
         },
         {
            id: 3,
            label: '更新'
         },
         {
            id: 4,
            label: '开发者工具',
            exec() {
               exec('debug/devtool')
            }
         },
         {
            id: 5,
            label: 'github',
            exec() { send('open-window', 'github') },
         },
         {
            id: 6,
            label: 'debug',
            exec() {
               addPanel(new PanelParam({
                  type: PanelType.DEBUG,
                  label: 'DEBUG',
                  data: 'debug-panel'
               }))
            },
         },
      ]

   },
   {
      id: 5,
      label: '社区',
      sub: [
         {
            id: 0,
            label: 'Mental Omega',
            exec() { location.href = this.value },
            value: 'https://mentalomega.com/'
         },
         {
            id: 1,
            label: 'ModEnc',
            exec() { location.href = this.value },
            value: 'https://modenc.renegadeprojects.com/Main_Page'
         },
         {
            id: 2,
            label: 'Ares',
            exec() { location.href = this.value },
            value: 'https://ares-developers.github.io/Ares-docs/index.html',
         },
         {
            id: 3,
            label: 'Phobos',
            exec() { location.href = this.value },
            value: 'https://phobos.readthedocs.io/zh-cn/latest/New-or-Enhanced-Logics.html',
         },
         {
            id: 4,
            label: 'PPM',
            exec() { location.href = this.value },
            value: 'https://ppmforums.com/',
         }
      ]

   },
]

export function invokeMenuOption(menuId: number, subMenuId: number) {
   const item = menuList[menuId]?.sub[subMenuId]
   if (item && item.exec) item.exec()
}

