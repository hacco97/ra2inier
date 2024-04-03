import { exec, useLogger, work } from '@/boot/apis';
import { IniObjectRo } from '@ra2inier/core';

import { useHistory } from '../history';
import { ProjectBoot, createEmpty } from './boot';


// 对象操作历史记录逻辑
const { push } = useHistory(({ type, object }: Backup) => {

})


interface Backup {
   type: string,
   object: IniObjectRo
}

export function createObjectAction(boot: ProjectBoot) {
   const logger = useLogger('object-action')
   const { setValue } = boot
   const mainKey = () => boot.project.main!.key

   /**
    * 创建一个新的对象
    */
   function addObject(name = 'NEW_OBJECT') {
      const newOne: IniObjectRo = new IniObjectRo(name)
      newOne.package = mainKey()
      setValue('objects', newOne.key, newOne)
      return newOne
   }

   function backupObject(object: IniObjectRo) {
      push({ type: 'backup', object })
   }

   /**
    * 保存一个对象，不论是新对象还是改对象
    */
   async function saveObject(object: IniObjectRo) {
      // 先向后端发送数据，更新后端的数据
      const { status, data } =
         await exec<string>('project/save-object/' + object.key, { data: object })
      const workRes = await work<string>('object/sync', { data: [object] })
      if (status && workRes.status) {
         logger.info('对象保存成功', object.fullname)
         // 如果是修改对象则更新和备份旧的对象
         const toDel = setValue('objects', object.key, object)
         if (toDel) backupObject(toDel)
      }
      else logger.warn('对象保存失败', data)
   }

   /**
    * 从后端和worker删除一个对象
    */
   function deleteObject(object: IniObjectRo) {
      exec<boolean>('project/delete-object/' + object.key).then((res) => {
         if (res.status) {
            const toDel = setValue('objects', object.key, undefined)
            toDel && backupObject(toDel)
            logger.info('删除对象成功', object.fullname)
         } else {
            logger.warn('删除对象失败', res.data)
         }
      })
   }

   return {
      addObject,
      saveObject,
      deleteObject
   }
}

export const EMPTY_OBJECT_ACTION = createEmpty(createObjectAction)
