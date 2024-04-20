import { overrideArray, removeFrom } from "@ra2inier/core"


export interface IItem {
	[s: string]: any
	/**
	 * 在list item中显示的文字
	 */
	value: string
	/**
	 * 是否被选中
	 */
	selected: boolean
	/**
	 * 用以生成vue key值
	 */
	key: string
	/**
	 * 是否以小型文字，显示更多信息
	 */
	detail: string
}

export class Item implements IItem {
	[s: string]: any
	id = ''
	key = ''
	value = ''
	selected = false
	detail = ''

	constructor(x: Partial<IItem> | string) {
		if (typeof x === 'string') {
			this.value = x
		} else {
			Object.assign(this, x)
			this.value = x.value || ''
			this.detail = x.detail || ''
			this.selected = !!x.selected
			this.key = x.key || Math.random() + ''
		}
		this.id = '+' + Math.random()
	}
}

export type EmitType = [item: Item, order: number]

export class ListViewState extends Array<Item> {
	/**
	 * 是否展示删除按钮
	 */
	deleteButton = true
	/**
	 * 是否展示选择框
	 */
	checkBox = true
	/**
	 * 选择框是否可以选择（是否可变）
	 */
	selectable = true
	/**
	 * 选择框为单选
	 */
	singleSelect = false
	/**
	 * 是否展示细节
	 */
	showDetail = true

	constructor(initList: (Partial<IItem> | string)[] = []) {
		let tmp: any
		if (typeof initList === 'number') tmp = [initList]
		else tmp = initList.map(x => new Item(x))
		super(...tmp)
	}

	/**
	 * 替换整个列表
	 */
	update(list: (Partial<IItem> | string)[] = []) {
		overrideArray(list.map(x => new Item(x)), this)
	}

	add(x: string | IItem) {
		const tmp = new Item(x)
		this.push(tmp)
		return tmp
	}

	remove(id: string): Item | undefined
	remove(id: () => boolean): Item | undefined
	remove(id: any) {
		let target: Item | undefined
		if (typeof id === 'function') target = removeFrom(this, id)
		else target = removeFrom(this, x => x.id === id)
		if (!target) return target
	}

	select(value: string): Item | undefined
	select(value: () => boolean): Item | undefined
	select(value: any): Item | undefined {
		let target: Item | undefined = undefined
		if (typeof value === 'function') this.find(value)
		else target = this.find(x => x.value === value)
		if (!target) return
		if (this.singleSelect) {
			this.forEach(x => x.selected = false)
			target.selected = true
		} else {
			target.selected != target.selected
		}
	}
}

