import { EventEmitter, useSingleton } from '@ra2inier/core';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

// 记录视图布局相关的数据，这些数据需要全局共享
const LEFTWIDTH = Symbol(), FOOTHEGHT = Symbol(), MEMO = Symbol(), CLOSED = Symbol(), CHANCE = Symbol()

// 左边栏的宽度
export class LeftTabSize {
	[LEFTWIDTH] = 0;
	[MEMO] = 300;
	[CLOSED] = true

	get widthS() { return { 'flex-basis': this.width + 'px' } }

	close() {
		this[MEMO] = this[LEFTWIDTH]
		this[LEFTWIDTH] = 0
		this[CLOSED] = true
	}

	open() {
		this[LEFTWIDTH] = this[MEMO]
		this[CLOSED] = false
	}

	get width() { return this[LEFTWIDTH] }
	set width(val) {
		if (val > 0) this[CLOSED] = false
		this[LEFTWIDTH] = val
	}
}

// 下边栏的高度
export class FootTabSize extends EventEmitter {
	[FOOTHEGHT]: number = 25;
	[MEMO]: number = 300;
	[CLOSED]: boolean = true;
	canHidden = false
	active = false

	get heightS() { return { height: this[FOOTHEGHT] + 'px' } }
	recover() {
		this[FOOTHEGHT] = this[MEMO]
		if (this[FOOTHEGHT] > 0) this[CLOSED] = false
	}
	// 无记忆
	min() {
		this[MEMO] = this[FOOTHEGHT]
		this[FOOTHEGHT] = 0
		this[CLOSED] = true
	}
	// 无记忆
	max() {
		this[MEMO] = this[FOOTHEGHT]
		this[FOOTHEGHT] = 9999
		this[CLOSED] = true
	}
	get height() { return this[FOOTHEGHT] }
	set height(val) {
		if (val > 0) this[CLOSED] = false
		this[MEMO] = this[FOOTHEGHT]
		this[FOOTHEGHT] = val
	}

	[CHANCE] = 0
	giveAChance() { this[CHANCE]++ }

	tryClose() {
		if (this[CHANCE] > 0) {
			this[CHANCE]--
			return
		}
		if (this.active) return
		this.min()
		this.active = false
	}
}

const createLayoutState = () => {
	const leftTabSize = reactive(new LeftTabSize)

	const footTabSize = reactive(new FootTabSize)

	// 全局遮罩
	const isMasked = ref(false)
	function closeMask(cb?: Function) {
		cb?.()
		isMasked.value = false
	}

	return {
		leftTabSize,
		footTabSize,
		isMasked: computed(() => isMasked.value),
		closeMask,
		showMask() { isMasked.value = true },
	}
}

export const useLayoutState = defineStore('layout-state', { state: useSingleton(createLayoutState) })
export type LayoutState = ReturnType<typeof useLayoutState>
