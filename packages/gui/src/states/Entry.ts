import { reactive, shallowReactive } from 'vue';
import { createParam, Entry, WordRo, WordValidity } from '@ra2inier/core';

// 常量定义
const NULL_WORD = new WordRo('未知词条')
NULL_WORD.valueParam = [createParam()]
const ENTRY_VID = Symbol()

// 字段对象，代表一个字段的所需信息
export class EntryRo implements Entry {
	static nextID = 0
	readonly id: number = 0
	// 顺序，用于焦点逻辑和排序逻辑
	order: number = 0
	// 字段的word名字
	wordName: string = ''

	// 字段的word具体值，列表，中间用“,”分割
	values: string[] = [];
	// 当前字段的活动值索引
	[ENTRY_VID] = 0
	get vid() { return this[ENTRY_VID] }
	set vid(vid: number) {
		vid >= this.values.length && (vid = this.values.length - 1)
		vid < 0 && (vid = 0)
		this[ENTRY_VID] = vid
	}
	// 字段的注释
	comment?: string
	// 是否折叠子面板
	isSubFolded = true
	// 该字段是否被选中
	selected: boolean = false
	// 该字段的合法性
	validitys: WordValidity[] = []
	// 该字段的合法性，提示
	prediction: string = '';

	constructor(entry: Entry) {
		this.id = EntryRo.nextID++
		this.wordName = entry.wordName
		this.values = (entry.values || [])
	}

	set value(value: string) {
		// TODO: 在此进行赋值的拦截

		this.values[this.vid] = value
	}

	get value() {
		return this.values[this.vid ?? 0]
	}

	setValue(val: any, vid?: number) {
		this.values[vid ?? this.vid] = val + ''
	}

	getFullValue() {
		return this.values.join(',')
	}

	push(str: string) {
		this.values.push(str)
	}

	pop(vid?: number) {
		vid ?? (vid = this.vid)
		return this.values.splice(vid, 1)[0]
	}

	get length() { return this.values.length }
}


export function createEntryRo(entry: Partial<Entry>) {
	return shallowReactive(new EntryRo({
		wordName: entry.wordName || '',
		values: entry.values || [],
		comment: entry.comment
	}))
}