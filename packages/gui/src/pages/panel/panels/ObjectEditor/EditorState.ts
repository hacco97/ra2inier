import { computed, reactive, ref, shallowReactive, StyleValue } from 'vue';
import { cloneTyped, Entry, EventEmitter, IniObjectRo, removeFrom, } from '@ra2inier/core';
import { createEntryRo, EntryRo } from './Entry';

const COLUMN_COUNT = Symbol('column count')
/**
 * 管理单个ObjectEditor的数据
 */
export class EditorState extends EventEmitter {
	// 源对象数据
	data: IniObjectRo
	// 词条数据
	entrys = shallowReactive<EntryRo[]>([])
	get(id: number) { return this.entrys[id] }
	// 新词条输入框的文字值
	theNew = ''
	// 对象详情
	detail = ''
	// 当前子对象
	currentChild = '';

	// 分栏数目
	[COLUMN_COUNT] = 1
	get columnCount() { return this[COLUMN_COUNT] }
	set columnCount(val: number) {
		if (val < 1) val = 1
		if (val > 4) val = 4
		this[COLUMN_COUNT] = val
	}

	/**
	 * 最终保存和提交数据的函数
	 */
	get value() {
		// 拷贝数据到原对象中
		if (!this.data) return
		const ret = cloneTyped(this.data, IniObjectRo)
		ret.entry = []
		ret.detail = this.detail
		let tmp: Entry
		for (let word of this.entrys) {
			tmp = {
				wordName: word.wordName,
				values: word.values
			}
			word.comment && (tmp.comment = word.comment)
			ret.entry.push(tmp)
		}
		return ret
	}

	constructor(object: IniObjectRo) {
		super()
		const word: IniObjectRo = this.data = cloneTyped(object, IniObjectRo)
		for (let i = 0, len = word.entry.length; i < len; ++i) {
			const tmp = createEntryRo(word.entry[i])
			this.entrys.push(tmp)
		}
		this.detail = object.detail
		this.reOrder()
	}

	/**
	 * 添加一个词条，返回索引值，若已存在则返回那个词条的索引值
	 */
	insert(name = '', val = '') {
		if (!name) return -1
		const words = this.entrys
		for (let i of words) {
			if (i.wordName === name) return i.order
		}
		this.entrys.push(createEntryRo({
			wordName: name,
			values: [val]
		}))
		this.reOrder()
		return this.entrys.length - 1
	}

	/**
	 * 删除词条
	 */
	deleteEntryById(id: number) {
		for (let index = 0; index < this.entrys.length; index++) {
			const element = this.entrys[index];
			if (element.id === id) return this.entrys.splice(index, 1)
		}
		this.reOrder()
		return undefined
	}

	/**
	 * 取消所有词条的选中
	 */
	removeSelected() {
		removeFrom(this.entrys, e => e.selected)
		this.reOrder()
	}

	/**
	 * 为该词条添加注释
	 */
	commentById(id: number, comment: string) {
		if (this.entrys[id])
			this.entrys[id].comment = comment
	}

	/**
	 * 修改词条数据
	 */
	setValueById(id: number, val: string | number, vid?: number) {
		this.entrys[id].setValue(val + '', vid)
	}

	// 词条值编号逻辑
	length = 0
	/**
	 * 重新为每个词条编号，为了让focus逻辑运作所额外付出的逻辑负担
	 */
	reOrder() {
		let order = 0
		for (let i = 0; i < this.entrys.length; ++i) {
			const word = this.entrys[i]
			word.order = order
			order += word.values.length
		}
		this.length = order
	}
}

/**
 * 状态抽出：提示框的定位数据
 * 提示框的状态
 */
export function usePromptCoord() {
	const x = ref(0), y = ref(0)
	const translate = computed<StyleValue>(() => {
		return {
			translate: `${x.value}px ${y.value}px`,
		}
	})

	function onRowFocus(e: Event) {
		const el = <HTMLElement>e.currentTarget
		y.value = el.offsetTop + el.offsetHeight
	}

	function onColFocus(e: Event) {
		const el = <HTMLElement>e.currentTarget
		x.value = el.offsetLeft
	}

	return {
		translate,
		onRowFocus,
		onColFocus,
	}
}
