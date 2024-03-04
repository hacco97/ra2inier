import { mainPackage, useProject } from '@/stores/projectStore';

export function isReadonly(o: { package: string }) {
   return o.package !== mainPackage.value.key
}

const project = useProject()

export function queryPkgNameByKey(key: string) {
   return project.value.packages[key].name
}
