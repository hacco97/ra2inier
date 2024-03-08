import { Directive } from 'vue';

import { EventEmitter, IniObjectRo, WordValueType } from '@ra2inier/core';

import { EntryRo } from '../ObjectEditor/Entry';

/**
 * 常量定义
 */
export enum PromptType {
   str = 'str',
   enum = 'enum',
   obj = 'obj',
   int = 'int',
   float = 'float',
   color = 'color',
   new = 'new'
}

const TYPE_MAP = {
   [WordValueType.bool]: PromptType.enum,
   [WordValueType.color]: PromptType.color,
   [WordValueType.enum]: PromptType.enum,
   [WordValueType.float]: PromptType.float,
   [WordValueType.int]: PromptType.int,
   [WordValueType.obj]: PromptType.obj,
   [WordValueType.str]: PromptType.str,
   [WordValueType.unknown]: PromptType.str,
   [PromptType.new]: PromptType.new
}

export function getPromptType(t: WordValueType) {
   return TYPE_MAP[t] ?? PromptType.str
}

const ENTRY = Symbol('entry')
const FOCUS_CHANGE_WHEN_ACTIVE = Symbol()

/**
 * 提示框组件，可以辅助用户进行输入，作为用户的草稿纸
 */
export class PromptState extends EventEmitter {

   /**
    * 提示框必须基于一个entry，才能正常工作，entry由使用者进行注入
    */
   declare [ENTRY]: EntryRo;
   get entry() { return this[ENTRY] }
   set entry(entry: EntryRo) {
      this[ENTRY] = entry
      this.type = PromptType.str
      if (!entry) return
      this.type = getPromptType(entry.typeParam?.type)
   }

   //提示框的类型
   type: PromptType = PromptType.str

   /**
    * 提示框在展示逻辑
    */
   isShowed = false
   show() {
      this.isShowed = true
      this[ENTRY] && this.emit('init-' + this.type, this[ENTRY])
   }
   hide() { this.isShowed = false }
   /**
    * 提示框激活逻辑。提示框展示之后，并不能直接开始工作，需要在active状态下才能开始工作
    */
   isActive = false
   active() {
      if (!this.entry || this.entry.isNullWord) return false
      this.isActive = true
      this.show()
      if (this[FOCUS_CHANGE_WHEN_ACTIVE].has(this.type))
         this.emit('focus-child')
      return true
   }
   unactive() { this.isActive = false }

   close() {
      this.isActive = false
      this.isShowed = false
   }

   [FOCUS_CHANGE_WHEN_ACTIVE] = new Set<string>([
      PromptType.int,
      PromptType.float,
      PromptType.color
   ])

   /**
     * 提示框留存逻辑，当用户点击提示框使得输入框失去焦点的时候，原本提示框会隐藏，但是
     * 添加该逻辑之后，提示框可以暂时留存
     */
   isFocus = false

   /**
    * 对外提供的上下方向键逻辑
    */
   next() {
      this.emit('next-' + this.type)
   }

   /**
    * 对外提供的上下方向键逻辑
    */
   prev() {
      this.emit('prev-' + this.type)
   }

   /**
    * 改变当Type为obj时的，option选项值
    */
   setObjects(objects: IniObjectRo[]) {
      if (this.type === PromptType.obj)
         this.emit('init-' + PromptType.obj, objects)
   }

   /**
    * 如果entry不为空，则提交当前的prompt值到entry当中，调用该方法时，必须保证prompt还在展示
    * 否则将提交空值
    */
   submitValue() {
      this.emit('submit-request')
   }
}


/**
 * 提示框的主动focus逻辑，由其他组件调用的Prompt组件逻辑
 */
export function useChildFocus() {
   const map: Record<string, HTMLElement> = {}
   const d: Directive<HTMLElement, string> = {
      mounted(el, { value }) {
         el.tabIndex = -1
         map[value] = el
      }
   }

   function focusChild(child: string) {
      setTimeout(() => { map[child]?.focus() })
   }

   return {
      vChildFocus: d,
      focusChild
   }
}


