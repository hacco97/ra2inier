import { useKeyMap } from '@/hooks/keymap';

import { PromptState } from './promptState';

export function usePromptKeymap(state: PromptState) {

   const vKeymap = useKeyMap({
      arrowup() { state.emit('prev-' + state.type) },
      arrowdown() { state.emit('next-' + state.type) },
      arrowleft() { state.emit('left-' + state.type) },
      arrowright() { state.emit('right-' + state.type) },
      enter() { state.emit('enter-' + state.type) }
   }, { prevent: false })

   return vKeymap
}
