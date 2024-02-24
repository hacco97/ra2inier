import { exec, listen, work } from '@/boot/apis';
import all, {
  fromRaw, getPackage, IniObjectRo, objects, project,
} from '@ra2inier/core';

import { useHistory } from '../history';
import useLog from '../messageStore';

const log = useLog('object-store')

// 对象操作历史记录逻辑
const { push } = useHistory(({ type, object }: Backup) => {

})

/**
 * 创建一个新的对象
 */
export function createIniObject() {
   const newOne: IniObjectRo = new IniObjectRo
   newOne.package = project.main!.key
   return newOne
}

/**
 * 克隆一个新的对象，并将其package设置为main的key
 */
export function cloneIniObject(object: IniObjectRo) {
   const newOne: IniObjectRo = fromRaw(object, IniObjectRo, true)
   newOne.package = project.main!.key
   return newOne
}

/**
 * 向pkg中添加一个iniOBject
 * @param name
 */
function addObjectToPkg(name: string) {
   const newOne = createIniObject()
   newOne.name = name
   objects[newOne.key] = all.main.objects[newOne.key] = newOne
   return newOne
}

function deleteObjectFromPkg(object: IniObjectRo) {
   const tmp = getPackage(object.package)?.objects
   if (tmp) {
      const toDel = tmp[object.key]
      delete tmp[object.key]
      delete objects[object.key]
      return toDel
   }
   return undefined
}


/**
 * 在两个地方更新对象，全局objects仓库，全局packages
 * @param key 需要更新的对象的key值和新值
 */
function updateObjectInPkg(key: string, obj: IniObjectRo) {
   objects[key] && (delete objects[key])
   all.main.objects[obj.key] = objects[obj.key] = obj
}

interface Backup {
   type: string,
   object: IniObjectRo
}
function backupObject(object: IniObjectRo) {
   push({ type: 'backup', object })
}

/**
 * 保存一个对象，不论是新对象还是改对象
 */
export async function saveObject(object: IniObjectRo) {
   // 在更新对象之后需要更新对象的键值
   object.update()
   // 先向后端发送数据，更新后端的数据
   const { status, data } =
      await exec<string>('project/save-object/' + object.key, { data: object })
   const workRes = await work<string>('object/sync', { data: [object] })

   if (status && workRes.status) {
      log.info('对象保存成功', object.fullname)
      // 如果是修改对象则更新和备份旧的对象
      const toDel = objects[object.key]
      if (!toDel) return
      backupObject(toDel)
      updateObjectInPkg(toDel.key, object)
   }
   else log.warn('对象保存失败', data)
}


/**
 * 从后端和worker删除一个对象
 */
export function deleteObject(object: IniObjectRo) {
   exec<boolean>('project/delete-object/' + object.key).then((res) => {
      if (res.status) {
         const toDel = deleteObjectFromPkg(object)
         toDel && backupObject(toDel)
         log.info('删除对象成功', object.fullname)
      } else {
         log.warn('删除对象失败', res.data)
      }
   })
}

listen('get-object', ({ key }) => {
   return objects[key]
})


