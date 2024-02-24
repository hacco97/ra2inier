import { reactive } from 'vue';

import box from '@/asset/icons/box.svg?raw';
import code from '@/asset/icons/code.svg?raw';
import launch from '@/asset/icons/launch.svg?raw';
import projres from '@/asset/icons/projres.svg?raw';
import res from '@/asset/icons/res.svg?raw';
import tutorial from '@/asset/icons/tutorial.svg?raw';

// 左边栏的选项卡

export interface LeftTab {
   id: number,
   order: number,
   label: string,
   type: string,
   name?: string
}


export const tabList = reactive<LeftTab[]>([
   {
      id: 0,
      order: 0,
      label: projres,
      type: 'ProjRes'
   },
   {
      id: 1,
      order: 1,
      label: code,
      type: 'Meta'
   },
   {
      id: 2,
      order: 2,
      label: res,
      type: 'Resource'
   },
   {
      id: 3,
      order: 3,
      label: launch,
      type: 'Launcher'
   },
   {
      id: 4,
      order: 4,
      label: box,
      type: 'Addons'
   },
   {
      id: 5,
      order: 5,
      label: tutorial,
      type: 'Tutorial'
   },
])


interface StraItem {
   id: number,
   order: number,
   name: string,
   url: string
}

export const starList = reactive<StraItem[]>([
   {
      id: 0,
      order: 0,
      name: '天启坦克',
      url: '#/test'
   },
   {
      id: 1,
      order: 1,
      name: '光棱坦克',
      url: '#/'
   },
   {
      id: 2,
      order: 2,
      name: '谭雅',
      url: '#/d'
   },
])
