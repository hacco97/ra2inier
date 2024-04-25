import { Directive, ref } from 'vue';

export function useFocus(isNormalElement = false) {
	const current = ref(-1)
	const map = new Map<number, HTMLElement>()
	const sel = getSelection()!

	function registerFocusElement(el: HTMLElement, binding: { value: number }) {
		map.set(binding.value, el)
	}

	function updateFocusElement(el: HTMLElement, binding: { value: number }) {
		map.set(binding.value, el)
	}

	function unRegisterFocusElement(el: HTMLElement, binding: { value: number }) {
		map.delete(binding.value)
	}

	function focusAt1(order: number) {
		setTimeout(() => {
			map.get(order)?.focus()
			current.value = order
		}, 10)
	}

	function focusAt2(order: number) {
		setTimeout(() => {
			sel.selectAllChildren(map.get(order)!)
			sel.collapseToEnd()
			current.value = order
		}, 10)
	}

	const focusAt = isNormalElement ? focusAt2 : focusAt1

	function focusNext(step = 1) {
		focusAt((current.value += step) % map.size)
	}

	function focusPrev(step = 1) {
		focusAt(((current.value -= step) + map.size) % map.size)
	}

	function focusCurrent() {
		focusAt(current.value)
	}

	function setCurrent(focusID: number) {
		current.value = focusID
	}

	function deleteFocus() {
		map.delete(map.size - 1)
	}

	function focusLast() {
		focusAt(map.size - 1)
	}

	const directive: Directive<HTMLElement, number> = {
		mounted: registerFocusElement,
		beforeUpdate() { map.clear() },
		updated: updateFocusElement,
		unmounted: unRegisterFocusElement
	}

	function blur() {
		map.get(current.value)?.blur()
	}

	return {
		map,
		current,
		directive,
		focusAt,
		focusNext,
		focusPrev,
		focusCurrent,
		focusLast,
		setCurrent,
		deleteFocus,
		blur
	}
}

export type Focus = ReturnType<typeof useFocus>
