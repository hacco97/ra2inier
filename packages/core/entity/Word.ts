import { UniqueObject } from './Obejct';

export class Word extends UniqueObject {
   brief: string = ''    // 概要
   default: string = ''  // 默认值，纯文本
   author: string = ''   // 作者信息表达式
   files: string[] = []  // 可以在哪些文件下使用，纯文本
   dictionary: string = 'custom'  // 字典的名称，使用的是该word的父文件夹的名字

   values: string = ''         // 一个使用'values表达式语法'的字符串
   valueParam: WordValueTypeParam[] = []
   scopes: string[] = [] // 决定在哪些scope下进行使用,scopes的key值
   hookScript: string = ''    // js代码 纯文本值
}

/**
 * values 表达式语法
   bool,bool(),bool('为真时的解释','为假时的解释')
   int(,下界),int(上界,),int(下界,上界)   闭区间
   float(下界,上界)    闭区间
   str,str(),str(正则表达式)
   enum(可能的值1,可能的值2),  enum(可能的值1:值1解释,可能的值2:值2解释)
   obejct(scope名字)
   color()

   *号，表示一个类型的数值的重复次数,
   int()*3,表示三个数字，多个类型参数中间用逗号分割，只有最后一个参数可以使用可变参数
 */
export enum WordValueType {   // 定义输入框UI种类
   str = 'str',    // 字符串类型，无验证

   int = 'int',
   float = 'float',

   bool = 'bool',  //
   enum = 'enum',  // 枚举类型，可以让UI界面生成下拉选择框
   obj = 'obj',    // 对象类型，可以让UI界面生成下拉选择框，去project里面寻找相应的对象

   color = 'color',

   unknown = 'unknown'  // 解析错误的类型
}


export interface WordValueTypeParam {
   exp: string,
   type: WordValueType,

   // 类型为bool和enum时的参数
   optiontmp?: string[]
   optionRemarks?: string[]

   // 类型为int和float的时候的参数
   max?: number
   min?: number

   // 类型为字符串的时候的参数
   regex?: string

   //
   objectType?: string
   repeat?: number
}

/**
 * 钩子脚本默认模板
 */
export const HOOK_FILE_TEMPLATE = `\
function validate(val, ctx) {

}

function translate(values, ctx) {

}

function adjust(entrys, ctx) {

}

function output(val, ctx) {

}

export default {
   validate,
   translate,
   adjust,
   output
}
`
