import { useProjectStore } from "@/stores/projectStore"
import { onUnmounted, ref } from "vue"
import { EntryRo } from "@/states/Entry"
import { PromptState, PromptType } from "@widget/Prompt/promptState"
import { FlexInput } from "@ra2inier/wc"
import { WordValueType } from "@ra2inier/core"
import { useDisabled } from "@/hooks/disabledFn"

/**
 * 状态抽出：游标的定位数据
 * 游标标识的逻辑
 */
export function useCursorCoord() {
	// entry的ID值
	const current = ref(-1)
	function onRowClick(eid: number) {
		current.value = eid
	}

	return {
		onRowClick,
		current,
	}
}

/**
 * 单词查找逻辑
 */
export function useQueryWord() {
	const store = useProjectStore()

	async function validateWord(entry: EntryRo) {
		const word = await store.queryWordAsync(entry.wordName)
		const validity = await store.validateWord(word.key, entry.values)
		if (!entry.validitys.find(
			x => x.status === validity.status && x.msg === validity.msg
		)) { entry.validitys.push(validity) }
	}

	return {
		validateWord
	}
}


/**
 * 对象查询逻辑
 */
export function useQueryObject(promptState: PromptState) {
	const store = useProjectStore()

	const [onInputKeyup] = useDisabled(async (e: KeyboardEvent) => {
		if (promptState.type !== PromptType.obj) return
		if (e.ctrlKey || e.altKey) return
		if (e.key.length !== 1 && !whiteName.has(e.key)) return
		await changeObjectsOptions((<FlexInput>e.target).value)
		await waitALittle()
		return undefined
	})

	function changeObjectsOptions(startString: string) {
		const word = store.queryWord(promptState.entry.wordName)
		const param = word.valueParam[promptState.entry.vid]
		if (param.type !== WordValueType.obj) return
		const objects = store.queryObject('objects', (object) => {
			let rate = 0
			if (object.scope === param.objectType) rate += 2
			if (object.name.startsWith(startString)) rate += 2
			else if (object.name.toLowerCase().startsWith(startString.toLowerCase()))
				rate += 1
			return rate
		})
		promptState.setObjects(objects)
	}

	function waitALittle() {
		return new Promise(r => setTimeout(r, 50))
	}
	const whiteName = new Set(['Backspace', 'Delete'])

	return {
		onInputKeyup
	}
}

export function useWindowResize(cb: (e: Event) => void) {
	window.addEventListener('resize', cb)
	onUnmounted(() => {
		window.removeEventListener('resize', cb)
	})
}
