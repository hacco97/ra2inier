

import { Directive, StyleValue, reactive, watch } from 'vue';
import { PanelParam, PanelType, usePanelState } from '@/states/panelList';
import { cloneTyped, EventEmitter, forIn, IniObjectRo, isEmptyObject, isUniqueObject, PackageRo } from '@ra2inier/core';
import { FlexInput } from '@ra2inier/wc';
import { useProjectStore } from '@/stores/projectStore';

export const DEFAULT_GROUP_NAME = 'G0'

export type PkgViewProp = { pkg: PackageRo, isMain?: boolean }
export class GroupViewInfo {
   /**
    * 组视图的顺序，从1开始，顺序越小排的越靠前
    */
   order = 99999999
   name = DEFAULT_GROUP_NAME

   constructor(name?: string, order?: number) {
      this.name = name || DEFAULT_GROUP_NAME
      this.order = order || 99999999
   }
}

export type PkgViewState = ReturnType<typeof createPkgViewState>
export function createPkgViewState(props: PkgViewProp) {
   const view: Record<string, Record<string, IniObjectRo>> = reactive({})
   const viewInfo: Record<string, GroupViewInfo> = reactive({})
   const store = useProjectStore()
   const panel = usePanelState()
   function initView() {
      const objects = props.pkg.objects
      for (const key in view) { delete view[key], delete viewInfo[key] }
      for (const key in objects) { addNewObjectToView(objects[key]) }
      reOrder()
   }

   function reOrder() {
      let order = 1
      forIn(viewInfo, (key, info) => {
         info.order = order++
      })
   }

   function addNewObjectToView(object: IniObjectRo) {
      if (!object.group) object.group = DEFAULT_GROUP_NAME
      const g = object.group
      if (!view[g]) view[g] = reactive({})
      if (!viewInfo[g]) viewInfo[g] = reactive(new GroupViewInfo())
      view[g][object.key] = object
   }

   watch(() => props.pkg, initView, { immediate: true })

   function openObjectPanel(object: IniObjectRo) {
      const opened = cloneTyped(object, IniObjectRo)
      const p: PanelParam = new PanelParam({
         label: opened.name,
         type: props.isMain ? PanelType.ObjectEditor : PanelType.ObjectViewer,
         init: opened,
         readonly: !props.isMain
      })
      const onSave = (o: IniObjectRo) => {
         const tmp = cloneTyped(o, IniObjectRo)
         store.saveObject(tmp)
         view[object.group] && (delete view[object.group][object.key])
         addNewObjectToView(tmp)
         reOrder()
      }
      if (props.isMain) { p.on('saved', onSave) }
      panel.addPanel(p)
   }

   function onAddClick(gKey?: string) {
      gKey || (gKey = DEFAULT_GROUP_NAME)
      const newOne = store.addObject()
      newOne.group = gKey
      openObjectPanel(newOne)
   }

   function onObjectOpen(object: IniObjectRo) {
      if (!isUniqueObject(object)) return
      openObjectPanel(object)
   }

   function createGroup() {
      let newGroup = 'G1'
      let next = 1
      while (newGroup in view) newGroup = 'G' + ++next
      view[newGroup] = {}
      viewInfo[newGroup] = new GroupViewInfo(newGroup)
      reOrder()
   }

   function deleteGroup(groupKey: string) {
      delete view[groupKey]
      delete viewInfo[groupKey]
   }

   function renameGroup(oldName: string, newName: string) {
      if (!(oldName in view) || newName in view) return
      const tmp = view[oldName]
      delete view[oldName]
      forIn(tmp, (key, object) => object.group = newName)
      view[newName] = tmp

      const tmp2 = viewInfo[oldName]
      delete viewInfo[oldName]
      viewInfo[newName] = tmp2
   }

   return {
      key: store.mainKey + Math.random(),
      view,
      viewInfo,
      addNewObjectToView,
      deleteGroup,
      renameGroup,
      createGroup,
      onAddClick,
      onObjectOpen,
      openObjectPanel,
      get path() { return props.pkg.path }
   }
}

/**
 * 组名的重叠控制
 */
export function useVFold(state: PkgViewState) {
   // 组名折叠
   const isGroupFoldedMap: Record<string, boolean> = reactive({})

   const getFoldedStyle = (key: string) => ({
      height: isGroupFoldedMap[key] ? '1lh' : 'fit-content',
      order: state.viewInfo[key]?.order
   })

   const getFolderStyle = (gkey: string) => (<StyleValue>{
      rotate: isGroupFoldedMap[gkey] ? '0deg' : '90deg',
      visibility: isEmptyObject(state.view[gkey]) ? 'hidden' : 'visible',
   })

   return {
      isGroupFoldedMap,
      getFoldedStyle,
      flip(key: string) {
         isGroupFoldedMap[key] = !isGroupFoldedMap[key]
      },
      getFolderStyle
   }
}

export function useVRename(emitter: EventEmitter) {
   return <Directive<FlexInput, string>>{
      mounted(el, { value: gkey }) {
         el.value = gkey
         el.disabled = true
      }
   }
}
