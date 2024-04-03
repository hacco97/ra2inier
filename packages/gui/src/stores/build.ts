
import { work } from '@/boot/apis';
import { IniObjectRo, ProjectRo, forIn } from '@ra2inier/core';
// import useLog from './messageStore';


// const logger = useLog('project-store')
let building = false

export function build(project: ProjectRo) {
   if (building) return
   const buildList: string[] = []
   // TODO: 从UI读取BuildList，此处暂时为全部构建
   forIn(getObjects(project), (key, val) => { buildList.push(key) })
   work<boolean>('project/build', buildList).then(({ status, data }) => {
      if (status) {
         // logger.info('构建成功')

      } else {
         // logger.warn('构建失败', data)
      }
   })
}

function getObjects(project: ProjectRo) {
   const tmp: Record<string, IniObjectRo> = {}
   forIn(project.packages, (key, pkg) => {
      forIn(pkg.objects, (okey, object) => {
         tmp[okey] = object
      })
   })

   return tmp
}
