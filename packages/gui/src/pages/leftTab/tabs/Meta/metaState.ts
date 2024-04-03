
import { useProjectStore } from '@/stores/projectStore';
import { MapperRo, ScopeRo, WordRo } from '@ra2inier/core';


export function isReadonly(o: { package: string }) {
   const store = useProjectStore()
   return o.package !== store.mainKey
}

export function save(type: 'word', word: WordRo): void
export function save(type: 'mapper', mapper: MapperRo): void
export function save(type: 'scope', scope: ScopeRo): void
export function save(type: string, val: any) {

}

export function getPackageName(o: { package: string }) {
   const store = useProjectStore()
   return store.packageNames[o.package]
}

