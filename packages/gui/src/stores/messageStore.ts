import { reactive, readonly } from 'vue';
import { IpcRendererEvent } from 'electron/renderer';
import { globalEvent, listenWorker, on, registerLog, useLogger, off } from '@/boot/apis';
import { LogLevel, Message, dateTime, useEffect } from '@ra2inier/core';
import { defineStore } from 'pinia';


const establishListener = useEffect((pushMsg: any) => {
	/*
	  注册一个消息的消费者
	  本模块负责将后端、worker和页面中的其他组件中产生的消息添加到统一的集合当中
	  这个消息集合将会由Message组件进行展示
	*/
	registerLog(useLogger('api-center'))

	// 监听后端的消息
	const listenerForBack = (event: IpcRendererEvent, l: LogLevel, msg: string, remark?: any) => {
		(l in LogLevel) || (l = LogLevel.info)
		pushMsg('backend', l, msg || '', remark)
	}
	on('log-from-backend', listenerForBack)

	// 监听前端的消息
	globalEvent.on('renderer-message', pushMsg)

	// 监听worker的消息
	listenWorker('send-log', ({ msg, level, remark }) => {
		pushMsg('worker', level, msg, remark)
	})

	return [undefined, () => {
		off('log-from-backend', listenerForBack)
		globalEvent.off('renderer-message')
	}]
})

// 消息通知模块的仓库
export const createMessageStore = () => {
	const messageList: Message[] = reactive([])
	let nextID = messageList.length

	const hooks: Record<string, Set<Function>> = {
		onMessage: new Set,
	}

	function onMessage(cb: () => void) {
		hooks.onMessage.add(cb)
	}

	function pushMsg(sender: string, level: LogLevel, msg: string, remark?: any) {
		messageList.push({
			id: nextID++,
			content: msg,
			remark: remark ?? '',
			time: dateTime(),
			read: false,
			sender,
			level
		})
		hooks.onMessage.forEach(cb => cb())
	}

	function readAll() {
		for (let msg of messageList) { msg.read = true }
	}

	function clearAll() {
		messageList.splice(0)
	}

	establishListener(pushMsg)

	return {
		messageList: readonly(messageList),
		/**
		 * 添加一条消息
		 */
		pushMsg,
		readAll,
		clearAll,
		/**
		 * 当新增消息时，可以被触发的回调函数
		 */
		onMessage
	}
}


export const useMessageStore = defineStore('message-store', { state: createMessageStore })
export type MessageStore = ReturnType<typeof useMessageStore>


const EXAMPLE = [
	{
		id: 0,
		content: "欢迎使用ra2 inier",
		time: new Date().toLocaleString(),
		remark: '',
		sender: 'ra2 inier',
		level: LogLevel.info
	},
	{
		id: 1,
		content: "欢迎使用ra2 inier1",
		time: new Date().toLocaleString(),
		remark: '',
		sender: 'ra2 inier',
		level: LogLevel.warn
	},
	{
		id: 2,
		content: "欢迎使用ra2 inier2",
		time: new Date().toLocaleString(),
		remark: '',
		sender: 'ra2 inier',
		level: LogLevel.debug
	},
	{
		id: 3,
		content: "欢迎使用ra2 inier3",
		time: new Date().toLocaleString(),
		remark: '',
		sender: 'ra2 inier',
		level: LogLevel.error
	},
]
