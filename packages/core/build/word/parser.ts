import { cloneDeep } from 'lodash';

import { WordValueType, WordValueTypeParam } from '@ra2inier/core/boot';

/**
  * 创建一个默认的wordParam
  */
export function createParam() {
   return <WordValueTypeParam>{
      type: WordValueType.str,
      exp: 'str()',
      repeat: 1
   }
}

const PARAM_LIKE = /(?<=\().+(?=\))/
const WHITE_SPACE = /\s+/g
const MAX_INT = 2 ** 31 - 1
const MIN_INT = 2 ** 31 * -1
const MAX_FLOAT = (2 - 2 ** -23) * 2 ** 127
const BOOL_tmp = ['yes', 'no']


/**
 * 解析word values属性的函数，将value属性解析成JS对象，
 * 该功能让UI提供对应的输入框，并使得UI能够对输入的词条进行初始的验证
 * @param exp 所需翻译的values表达式
 */
export function parseValueTypeExp(exp: string) {
   if (exp.length > 100) return []
   exp = exp.replaceAll(WHITE_SPACE, '')
   // 拆分成单个表达式
   const match = splitValueTypeExp(exp)
   // 解析单个表达式
   const tmp: WordValueTypeParam[] = []
   for (const param of match) {
      tmp.push(parseSingleValueTypeExp(param))
   }
   // 解析表达式的repeat参数
   return countRepeat(tmp, match)
}

function splitValueTypeExp(exp: string) {
   const match: string[] = []
   let char: string = '', prev = 0, isParam = false
   for (let i = 0; i < exp.length; ++i) {
      char = exp[i]
      if (char === '(' && !isParam) isParam = true
      else if (char === ')' && isParam) isParam = false
      else if (!isParam && char === ',') {
         match.push(exp.slice(prev, i))
         prev = i + 1
      }
   }
   if (prev !== exp.length - 1)
      match.push(exp.slice(prev, exp.length))
   return match
}

function countRepeat(list: WordValueTypeParam[], match: string[]) {
   const tmp = cloneDeep(list)
   for (let i = 0, len = tmp.length; i < len; ++i) {
      if (!match[i].includes('*')) {
         tmp[i].repeat = 1
         continue
      }
      const [_, _count] = match[i].split('*')
      if (_count === '') {
         tmp[i].repeat = 99
         continue
      }
      let count = parseInt(_count) ?? 1
      count = count < 0 ? 1 : count
      tmp[i].repeat = count > 99 ? 99 : count
   }
   return tmp
}


const splitter = /\(|\*/g
/**
 * 解析当个word表达式的值
 */
function parseSingleValueTypeExp(exp: string) {
   const match = exp.split(splitter)
   const funcName = match[0] ?? 'str'

   const arg = PARAM_LIKE.exec(exp)
   const args = arg ? arg[0].split(',') : []
   const param: WordValueTypeParam = {
      type: <WordValueType>funcName,
      exp: `${funcName}(${args.join(',')})`
   }
   switch (funcName) {
      case WordValueType.str:
         if (args.length === 1) param.regex = args[0]
         break
      case WordValueType.int:
         param.min = args[0] ? parseInt(args[0]) : MIN_INT
         param.max = args[1] ? parseInt(args[1]) : MAX_INT
         break
      case WordValueType.float:
         param.min = args[0] ? parseFloat(args[0]) : -MAX_FLOAT
         param.max = args[1] ? parseFloat(args[1]) : MAX_FLOAT
         break
      case WordValueType.bool:
         param.optiontmp = BOOL_tmp
         param.optionRemarks = [args[0] ?? '', args[1] ?? '']
         break
      case WordValueType.enum:
         param.optiontmp = []
         param.optionRemarks = []
         for (const i of args) {
            const [option, remark] = i.split(':')
            param.optiontmp.push(option)
            param.optionRemarks.push(remark)
         }
         if (param.optiontmp.length === 0) {
            param.type = WordValueType.unknown
            param.exp = exp
         }
         break
      case WordValueType.obj:
         param.objectType = args[0]
         break
      case WordValueType.color:
         break
      default:
         param.type = WordValueType.unknown
         param.exp = exp
   }
   return param
}
