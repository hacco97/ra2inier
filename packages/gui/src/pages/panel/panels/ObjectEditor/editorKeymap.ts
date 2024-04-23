import { Focus } from '@/hooks/focus';
import { useKeyMap } from '@/hooks/keymap';

import { PromptState } from '@widget/Prompt/promptState';
import { EditorState } from './EditorState';
import { EntryRo } from '@/states/Entry';

// const dict = useDict()
const VALIDATE_NEW = /^[a-zA-Z\$#@][a-zA-Z\d]*$/

function slice1(s: String) {
	return s[0].toUpperCase() + s.slice(1)
}

function slice2(s: string) {
	return s[0] + s[1].toUpperCase() + s.slice(2)
}

function defaultValidator(string: string) {
	string = string.trim()
	let ans = ''
	if (!string.match(VALIDATE_NEW)) return ans
	switch (string[0]) {
		case '$':

			ans = slice2(string)
			break
		case '#':

			ans = slice2(string)
			break
		case '@':

			ans = slice2(string)
			break
		default:
			ans = slice1(string)
	}
	return ans
}

interface Ctx {
	state: EditorState,
	promptState: PromptState,
	focus: Focus
}

export function useEditorKeymap(ctx: Ctx) {
	const { state, focus, promptState } = ctx

	function closeNav() {
		promptState.unactive()
		promptState.hide()
	}

	const inputKeymap = useKeyMap({
		enter() {
			if (promptState.isShowed && promptState.isActive) {
				promptState.submitValue()
				closeNav()
			} else {
				focus.focusLast()
			}
		},
		'ctrl+arrowdown'(e) { focus.focusLast() },
		'shift+arrowdown'(e) { focus.focusNext(5) },
		arrowup(e) {
			if (promptState.isShowed && promptState.isActive) {
				promptState.prev()
			} else {
				closeNav()
				focus.focusPrev()
			}
		},
		arrowdown() {
			if (!promptState.isShowed) return focus.focusNext()
			if (promptState.isActive) return promptState.next()
			if (!promptState.active()) focus.focusNext()
		},
		'ctrl+arrowup'() {
			focus.focusAt(0)
			closeNav()
		},
		'shift+arrowup'() {
			focus.focusPrev(5)
			closeNav()
		},
		'alt+,'(e: KeyboardEvent, entry: EntryRo) {
			focus.blur()
			entry.push('')
			state.reOrder()
			focus.focusNext()
		},
		'ctrl+alt+,'(e, entry: EntryRo) {
			if (entry.length > 1) {
				focus.blur()
				entry.pop()
				state.reOrder()
				focus.focusPrev()
			}
		},
		escape() { closeNav() },
		backspace(e, entry: EntryRo) {
			if (this.textContent !== '') return false
			focus.blur()
			if (entry.length > 1) { entry.pop() }
			else { state.deleteEntryById(entry.id) }
			state.reOrder()
			focus.focusPrev()
			return false
		}
	}, { prevent: true, tabindex: 0 })

	const theNewKeymap = useKeyMap({
		enter(e) {
			const newOne = defaultValidator((<HTMLInputElement>this).value)
			if (!newOne) return
			const target = state.insert(newOne)
			if (target < 0) return
			focus.focusAt(target);
			(<HTMLInputElement>this).value = ''
		},
		arrowup(e) { focus.focusPrev() },
		arrowdown(e) { focus.focusAt(0) },
		'ctrl+arrowup'() { focus.focusAt(0) },
		'shift+arrowup'() { focus.focusPrev(5) },
		'shift+arrowdown'(e) { focus.focusNext(5) },
		escape() { closeNav() }
	}, { prevent: true, tabindex: 0 })

	return {
		inputKeymap,
		theNewKeymap
	}
}


