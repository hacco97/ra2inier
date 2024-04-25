import { reactive, readonly, shallowReactive } from "vue";
import { FootTabType, useFoottabState } from '@/states/footTabList'
import { defineStore } from "pinia";
import { useLayoutState } from "./layout";
import { dateTime, useSingleton } from "@ra2inier/core";

export enum DialogType {
	askIf,
	askStr,
	askFile,
	show
}

const FINISH = Symbol(), COUNT = Symbol(), DATA = Symbol(), TYPE = Symbol()

export class Dialog {
	[s: string]: any
	static nextID = 0
	readonly id: number = 0

	/**
	 * 在界面上显示的信息
	 */
	question: any = ''
	/**
	 * 对话框的类型
	 */;
	[TYPE]: DialogType = 0
	get type() { return this[TYPE] }
	time: string = ''

	/**
	 * 是否已经完成，0为拒绝，1为接受
	 */;
	[FINISH] = -1
	get finished() { return this[FINISH] }

	declare finish: (res?: any) => void

	/**
	 * 计时器
	 */;
	[COUNT] = 10
	get count() { return this[COUNT] }

	constructor(question: any, type: DialogType = DialogType.show) {
		this.id = Dialog.nextID++
		this.question = question || ''
		this[TYPE] = type
		this.time = dateTime()
	}

	/**
	 * 用于交互的数据结构
	 */
	data: any = ''

	remark: string = ''
}

const countMap: Record<DialogType, number> = {
	[DialogType.askIf]: 9,
	[DialogType.askStr]: 99,
	[DialogType.askFile]: 99,
	[DialogType.show]: -1
}

class DialogParam {
	question: any = ''
	type = DialogType.askIf
	modal = true
	remark = ''
	count = 10
}

function createDialogState() {
	const list: Dialog[] = reactive([])
	const { footTabSize } = useLayoutState()
	const foottab = useFoottabState()

	function addDialog(question: string, type = DialogType.askIf, remark = '') {
		foottab.setDialogBadge(list.length + 1)
		return new Promise((solve) => {
			const d = new Dialog(question, type)
			const count = countMap[type]
			d[COUNT] = count > 5 ? count : -1
			d.finish = (res?: any) => {
				const target = list.find(val => val.id === d.id)
				if (target && target[FINISH] < 0) {
					target[FINISH] = Number(Boolean(res))
					d.time = dateTime()
					solve(res)
				}
			}
			const r = shallowReactive(d)
			list.push(r)
			if (d[COUNT] !== -1) {
				const stop = setInterval(() => {
					if (--r[COUNT] > 0) return;
					d.finish()
					clearInterval(stop)
				}, 1000)
			}
		})
	}

	async function showDialog(question: any, type?: DialogType.show, modal?: boolean): Promise<void | undefined>
	async function showDialog(question: any, type?: DialogType.askIf, modal?: boolean): Promise<boolean | undefined>
	async function showDialog(question: any, type?: DialogType.askFile | DialogType.askStr, modal?: boolean): Promise<string | undefined>
	async function showDialog(question: any, type: DialogType = DialogType.askIf, modal = true): Promise<any> {
		if (modal) {
			footTabSize.max()
			foottab.selectFootTabByType(FootTabType.Dialog)
		}
		const res = await addDialog(question, type)
		modal && footTabSize.recover()
		return res
	}

	return {
		list,
		showDialog,
	}
}

export const useDialogState = defineStore('dialog-state', { state: useSingleton(createDialogState) })
export type DialogState = ReturnType<typeof useDialogState>
