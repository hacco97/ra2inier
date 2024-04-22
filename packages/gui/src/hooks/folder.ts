import { Directive, ref, watch } from "vue"


export function useFolder(onClick?: (this: HTMLElement, ev: MouseEvent, value: boolean) => any, init: boolean = true) {
	const folded = ref(init)

	const vFolder: Directive<HTMLElement, any> = {
		mounted(el) {
			el.classList.add('folder')
			el.addEventListener('click', (ev) => {
				folded.value = !folded.value
				onClick && onClick.call(el, ev, folded.value)
			})
			watch(folded, () => el.setAttribute('folded', folded.value + ''), { immediate: true })
		}
	}

	return {
		folded,
		vFolder,
	}
}
