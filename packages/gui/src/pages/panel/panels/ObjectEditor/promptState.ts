import { Directive } from 'vue';

import { EventBus } from '@/hooks/eventBus';
import { WordValueType, WordValueTypeParam } from '@ra2inier/core';

import { EntryRo } from './eidtorState';

/**
 * 提示框组件，可以辅助用户进行输入，作为用户的草稿纸
 */
export class PromptState extends EventBus {

   /**
    * 提示框必须基于一个entry，才能正常工作，entry由使用者进行注入
    */
   declare entry: EntryRo
   setEntry(entry: EntryRo) {
      this.entry = entry
      this.type = PromptType.str
      if (!entry) return
      this.type = getPromptType(entry.typeParam?.type)
      this.initValue()
   }

   /**
    * 根据当前的type值和entry值对prompt的state进行初始化
    */
   private initValue() {
      if (!this.entry) return
      const entry = this.entry
      switch (this.type) {
         case PromptType.enum:
            this.createOptions(this.entry.typeParam)
            break
         case PromptType.int:
            this.setInt(parseInt(entry.value))
            break
         case PromptType.float:
            this.setFloat(parseFloat(entry.value))
         case PromptType.color:
            this.color = entry.value
         default:
            break;
      }
   }

   /**
    * 提示框在展示逻辑
    */
   isShowed = false
   show() { this.isShowed = true }
   hide() { this.isShowed = false }
   /**
    * 提示框激活逻辑。提示框展示之后，并不能直接开始工作，需要在active状态下才能开始工作
    */
   isActive = false
   active() {
      if (!this.entry || this.entry.isNullWord) return false
      this.isActive = true
      this.show()
      if (FOCUS_CHANGE_WHEN_ACTIVE.has(this.type))
         this.emit('focus-child')
      return true
   }
   unactive() { this.isActive = false }

   close() {
      this.isActive = false
      this.isShowed = false
   }

   /**
     * 提示框留存逻辑，当用户点击提示框使得输入框失去焦点的时候，原本提示框会隐藏，但是
     * 添加该逻辑之后，提示框可以暂时留存
     */
   isFocus = false

   //提示框的类型
   type: string = 'str'


   // **文本类型的逻辑**
   str: string = ''


   // **int类型的逻辑**
   int: number = 0
   setInt(n: number) {
      if (this.entry && this.type === PromptType.int) {
         const typeParam = this.entry.typeParam
         if (typeParam.max !== undefined && n > typeParam.max) n = typeParam.max
         if (typeParam.min !== undefined && n < typeParam.min) n = typeParam.min
         this.int = Math.round(n)
      }
   }
   increaseInt(n = 1) { this.setInt(this.int + n) }


   // **float类型的逻辑**
   float: number = 0
   floatText: string = ''
   setFloat(n: number) {
      if (this.entry && this.type === PromptType.float) {
         // const typeParam = this.entry.typeParam
         // if (typeParam.max !== undefined && n > typeParam.max) n = typeParam.max
         // if (typeParam.min !== undefined && n < typeParam.min) n = typeParam.min
         this.float = n
      }
   }
   increaseFloat(n = 1.0) { this.setFloat(this.float + n) }


   // **color类型的逻辑**
   color = ''


   // **enum类型的逻辑**
   options: Option[] = []
   // enum 类型的辅助参数
   cursor = 0
   /**
    * 初始化选项的工具函数
    */
   private createOptions(param: WordValueTypeParam) {
      const options: Option[] = []
      let id = 0
      switch (param.type) {
         case WordValueType.bool:
            options.push({
               id: 0,
               value: 'yes',
               text: (param.optionRemarks?.[0]) ?? ''
            })
            options.push({
               id: 1,
               value: 'no',
               text: (param.optionRemarks?.[1]) ?? ''
            })
            break
         case WordValueType.enum:
            for (let p in param.optiontmp) {
               options.push({
                  id,
                  value: p,
                  text: (param.optionRemarks?.[id++]) ?? ''
               })
            }
            break
         default:
      }
      this.options = options
   }
   nextOption() { this.cursor = (this.cursor + 1) % this.options.length }
   prevOption() { this.cursor = (this.cursor - 1 + this.options.length) % this.options.length }

   /**
    * 对外提供的上下方向键逻辑
    */
   next() {
      switch (this.type) {
         case PromptType.enum:
            this.nextOption(); break
         case PromptType.int:
            this.increaseInt(1); break
         case PromptType.float:
            this.increaseFloat(0.01); break
         default:
      }
   }
   /**
    * 对外提供的上下方向键逻辑
    */
   prev() {
      switch (this.type) {
         case PromptType.enum:
            this.prevOption(); break
         case PromptType.int:
            this.increaseInt(-1); break
         case PromptType.float:
            this.increaseFloat(-0.01); break
         default:
      }
   }

   /**
    * 获取提示框当前选定的值
    */
   get value() {
      switch (this.type) {
         case PromptType.str:
            return this.str
         case PromptType.enum:
            if (!this.isActive) return ''
            const tmp = this.options[this.cursor]
            return tmp ? tmp.value : ''
         case PromptType.int:
            return this.int
         case PromptType.float:
            return this.floatText
         default:
            return ''
      }
   }

   /**
    * 如果entry不为空，则提交当前的prompt值到entry当中，调用该方法时，必须保证prompt还在展示
    * 否则将提交空值
    */
   submitValue() {
      const ret = this.value + ''
      ret && this.entry?.setValue(ret)
   }
}

export interface Option {
   id: number,
   value: string,
   text: string,
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
      map[child]?.focus()
   }

   return {
      vChildFocus: d,
      focusChild
   }
}


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

const FOCUS_CHANGE_WHEN_ACTIVE = new Set<string>([
   PromptType.int,
   PromptType.float,
   PromptType.color
])

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
