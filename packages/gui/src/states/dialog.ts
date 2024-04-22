import { reactive, readonly } from "vue";
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


const FINISH = Symbol()

export class Dialog {
	[s: string]: any
	static nextID = 0
	id: number = 0

	/**
	 * 在界面上显示的信息
	 */
	question: any = ''
	/**
	 * 对话框的类型
	 */
	type: DialogType = 0
	time: string = ''

	/**
	 * 是否已经完成
	 */;
	[FINISH] = -1
	get finished() { return this[FINISH] }

	declare finish: (res?: any) => void

	constructor(question: any, type: DialogType = DialogType.show) {
		this.id = Dialog.nextID++
		this.question = question || ''
		this.type = type
		this.time = dateTime()
	}
}


function createDialogState() {
	const dialogs: Dialog[] = reactive([])
	const { footTabSize } = useLayoutState()
	const foottab = useFoottabState()

	function addDialog(question: string, type = DialogType.askIf) {
		let rejectHandler: Function
		setTimeout(() => rejectHandler?.(), 10_000)
		return new Promise((solve) => {
			rejectHandler = () => solve(undefined)
			const d = new Dialog(question, type)
			d.finish = (res?: any) => {
				const target = dialogs.find(val => val.id === d.id)
				if (target) {
					target[FINISH] = Number(Boolean(res))
				}
				d.time = dateTime()
				solve(res)
			}
			dialogs.push(d)
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
		list: readonly(dialogs),
		showDialog
	}
}

export const useDialogState = defineStore('dialog-state', { state: useSingleton(createDialogState) })
export type DialogState = ReturnType<typeof useDialogState>
