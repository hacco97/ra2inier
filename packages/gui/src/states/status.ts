

import { defineStore } from "pinia"
import { computed, ref } from "vue"

const createStatusState = () => {
	const statusText = ref('暂无status')
	let changing = false
	function setStatusText(status: string) {
		statusText.value = status
		changing = true
	}

	return {
		statusText: computed(() => statusText),
		setStatusText
	}
}


export const useStatusState = defineStore('status-state', { state: createStatusState })

