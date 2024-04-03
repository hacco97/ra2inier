import { ToDto } from '../dto';
import { Word } from '../entity/Word';
import { MarkdownRo } from './MarkdownRo';

export class WordRo extends Word implements ToDto {
   /**
    * markdown文件的内容
    */
   detail: string = ''
   /**
    * word的所在文件夹的名字
    */
   dir: string = ''
   /**
    * markdown文件本体
    */
   markdown?: MarkdownRo

   declare package: string
   declare hooks: WordHooks

   toDto() {
      return {
         ...this,
         package: undefined,
         hooks: undefined,
      }
   }
}

/**
 * word的验证函数钩子集合
 */
export interface WordHooks {
   /**
    * 获得该词条的word对象本身
    */
   getWord(): WordRo
   /**
    * 在用户输入期间和保存Object的时候调用，用于校验entry的值是否合法
    * 并提前对用户进行提示，返回值是对用户的提示内容
    */
   validate?(values: string[], ctx: HookCtx): WordValidity[],
   /**
    * 在一个词条的validity为真时，并且开始进行翻译时进行调用
    * 对一个对象的每个entry进行逐词条调用，返回值就是该词条的翻译后的值
    */
   translate?(values: string[], ctx: HookCtx): Translation,
   /**
    * 如果一个对象上包含该词条，那么adjust将在该对象完成了所有词条的翻译时调用，
    * 传入的值是该对象上所有的词条的键值，并且值已经经过了一轮的translate,
    * 如果有返回值，则该返回值将替换整个Object的翻译值
    */
   adjust?(entrys: string[][], ctx: HookCtx): string[][] | undefined,
   /**
    * 如果一个对象上包含该词条，那么output将在该对象即将被输出时调用，
    * 即在该对象的翻译值即将被传入mapper的inputHandler之前调用，
    * 如果有返回值，则该返回值将替换整个Object的准输出值
    */
   output?(preview: string[][]): string[][] | undefined
}



/**
 * 各个钩子函数在调用时被传入的参数ctx的类型
 */
export interface HookCtx {
   [key: string]: any,
   log(str: any): void,
}

/**
 * 词条的hooks属性辅助类，是validate钩子的返回值，
 * -1代表失败，0代表警告，1代表通过
 */
export class WordValidity {
   status: StatusCode = StatusCode.success
   msg: string = ''
}

export enum StatusCode {
   success = 1,
   warn = 0,
   fail = -1
}
/**
 * 词条的hooks属性辅助类，是translate钩子的返回值，
 * 如果直接返回string，则使用该值作为该词条的翻译结果
 * 如果返回二维数组，则将其中的每个子数组作为一个字段，左边键，右边值
 * [
 *    [key1,val1],
 *    [key2,val2]
 * ]
 */
export type Translation = string | string[][]

