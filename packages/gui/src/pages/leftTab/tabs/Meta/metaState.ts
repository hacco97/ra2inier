import { mainPackage } from '@/stores/projectStore';

export function isReadonly(o: { package: string }) {
   return o.package !== mainPackage.value.key
}

