import { UniqueObject } from './Obejct';

/**
 * Input处理函数，在每个对象被送入Mapper时调用，由对象的scope对应的handler来处理该对象
 */
export type InputHandler = (results: string[][], data: Object) => void

/**
 * output处理函数，在所有对象被统计完成之后，最后生成文件时被调用
 */
export type OutputHandler = (results: string[][], data: Object) => void


export type StartHandler = (data: Object) => void

export type FinalHandler = (data: Object) => string

export type MapperHandler = InputHandler | OutputHandler | StartHandler | FinalHandler

export class Mapper extends UniqueObject {
   detail: string = ''
   targetPath: string = '.'

   /**
    * 字符串为scope的名字值和匹配规则，OnInput为处理该scope的输入Mapper函数的名字
    */
   inputList: Record<string, string> = {}
   // 保存多个outputHandler，在处理时依次调用
   outputList: string[] = []
   //保存handler代码的js文件内容
   handlerScript: string = ''
}
