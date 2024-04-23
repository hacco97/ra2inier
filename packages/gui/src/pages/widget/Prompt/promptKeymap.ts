import { useKeyMap } from '@/hooks/keymap';

import { PromptState } from './promptState';

export function usePromptKeymap(state: PromptState) {

   const vKeymap = useKeyMap({
      arrowup(e) { state.emit('prev-' + state.type), e.preventDefault() },
      arrowdown(e) { state.emit('next-' + state.type), e.preventDefault() },
      arrowleft() { state.emit('left-' + state.type) },
      arrowright() { state.emit('right-' + state.type) },
      enter() { state.emit('enter-' + state.type) }
   }, { prevent: false })

   return vKeymap
}
