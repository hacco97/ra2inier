import { useKeyMap } from '@/hooks/keymap';

import { PromptState, PromptType } from './promptState';

export function usePromptKeymap(state: PromptState) {

   const vKeymap = useKeyMap({
      arrowup() { arrowups[state.type]?.() },
      arrowdown() { arrowdowns[state.type]?.() },
      arrowleft() { arrowlefts[state.type]?.() },
      arrowright() { arrowrights[state.type]?.() },
      enter() { enters[state.type]?.(); }
   }, { prevent: false })

   const arrowups: Record<string, Function> = {
      [PromptType.enum]() { state.prevOption() },
      [PromptType.int]() { state.increaseInt(1) },
      [PromptType.float]() { state.increaseFloat(0.01) },
   }
   const arrowdowns: Record<string, Function> = {
      [PromptType.enum]() { state.nextOption() },
      [PromptType.float]() { state.increaseFloat(-0.01) },
   }
   const arrowlefts: Record<string, Function> = {
      [PromptType.int]() { state.increaseInt(-10) },
      [PromptType.float]() { state.increaseFloat(-0.1) },
   }
   const arrowrights: Record<string, Function> = {
      [PromptType.int]() { state.increaseInt(10) },
      [PromptType.float]() { state.increaseFloat(0.1) },
   }
   const enters: Record<string, Function> = {
      [PromptType.int]() { },
      [PromptType.float]() { },
   }

   return {
      vKeymap,
      arrowups,
      arrowdowns,
      arrowlefts,
      arrowrights,
      enters
   }
}
