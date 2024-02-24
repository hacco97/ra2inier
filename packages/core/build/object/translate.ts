import {
  Entry, forIn, HookCtx, IniObjectRo, MapperHandler,
  MapperRo, safeScript, WordHooks, WordRo,
} from '@ra2inier/core/boot';

function preTranslator() {
   console.log('pre translate')
}

/**
 * @param object 需要翻译的对象
 * @param words 翻译该对象所需的全部词条 <word的名字：word本身>，如果entry没有对应的词条那就采用原val值
 * @returns 返回翻译之后的结果，若果有任何hook错误，则返回false
 */
export function objectTranslator(object: IniObjectRo, words: Record<string, WordRo>, ctx: HookCtx) {
   if (!(object && words)) return false

   // TODO: 预处理环境变量
   preTranslator()

   // 正式开始执行词条
   const translation: string[][][] = []
   const adjusts: Record<string, WordHooks['adjust']> = {}
   const outputs: Record<string, WordHooks['output']> = {}
   try {
      for (const entry of object.entry) {
         const hooks: any = words[entry.key]?.hooks ?? {}
         const ret = entryTranslator(entry, hooks.translate, ctx)
         if (!ret) return false
         translation.push(ret)

         // 记录adjust和output hook
         if (hooks.adjust) adjusts[entry.key] = hooks.adjust
         if (hooks.output) outputs[entry.key] = hooks.output
      }
   } catch (e) {
      ctx.log(e)
      return false
   }

   // 开始执行adjust hook
   return objectAdjuster(translation.flat(), adjusts, ctx)
}

/**
 * 翻译单个entry
 */
export function entryTranslator(entry: Entry, translate: WordHooks['translate'], ctx: HookCtx) {
   try {
      if (!translate) return [nullTranslator(entry)]
      const ret: string[][] = []
      const tr = translate(entry.values, ctx)
      if (typeof tr === 'string') {
         ret.push([entry.key, tr])
      } else if (tr instanceof Array) {
         ret.push(...tr)
      } else if (typeof tr === 'object') {
         for (const key in tr as any) { ret.push([key, tr[key]]) }
      } else {
         ret.push(nullTranslator(entry))
      }
      return ret
   } catch (e) {
      ctx.log(e)
      return false
   }
}

export function nullTranslator(entry: Entry) {
   return [entry.key, entry.values.join(',')]
}

export function objectAdjuster(entrys: string[][], adjusts: Record<string, WordHooks['adjust']>, ctx: HookCtx) {
   try {
      forIn(adjusts, (name, adjust) => {
         const ret = adjust?.(entrys, ctx)
         if (ret && ret instanceof Array) entrys = ret
      })
   } catch (e) {
      ctx.log(e)
      return false
   }
   return entrys
}


/**
 * 为mapper创建handlers
 */
export function createMapperHandlers(mapper: MapperRo) {
   const handlers = [...mapper.outputList, 'start', 'final']
   forIn(mapper.inputList, (key, val) => { handlers.push(val) })
   const f = safeScript(mapper.handlerScript, handlers)
   return f() as Record<string, MapperHandler>
}
