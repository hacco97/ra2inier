import { enhance, safeScript, WordHooks, WordRo } from '@ra2inier/core/boot';

/**
 * 为word对象生成hooks
 */
export function createWordHooks(word: WordRo) {
   const hooks: WordHooks = { getWord: () => word }
   let code = word.hookScript
   if (!code) return hooks
   const mod = safeScript(code, [
      'validate',
      'translate',
      'adjust',
      'output'
   ])
   return enhance<WordHooks>(hooks, mod())
}

