
import { Logger, Pipe } from '@ra2inier/core';
export * from './file'
export { work, listenWorker } from './worker'
export const on = window.eApi.on
export const send = window.eApi.send
export const off = window.eApi.off
export { globalEvent } from './event'
export { useLogger } from './logger'

/**
 * 建立与后端和worker交互的API接口
 */
function createAPI() {
	// 初始化日志和端口
	let logger: Logger
	let port: MessagePort

	function registerLog(logObject: Logger) {
		logger = logObject
	}

	// 使用send和on模拟的异步请求api
	const requestMap: Record<string, Function> = {}

	/**
	 * 向主进程发起请求并执行指定命令
	 */
	function exec<T>(command: string, options: RequestOptions = {}): Promise<ServResponse<T>> {
		return new Promise((solve) => {
			const id = Math.random()
			requestMap[id] = solve
			const f = () => {
				try {
					const tmp = options.data
					if (tmp && tmp.toDto) options.data = tmp.toDto()
					port.postMessage({ id, command, options })
				} catch (error) {
					logger.error('命令发送失败', {
						command,
						error,
						options
					})
				}
			}
			if (CONTROLL_READY) f()
			else execQueue.push(f)

			// 设置请求超时，默认为一分钟
			setTimeout(() => {
				if (requestMap[id]) {
					delete requestMap[id]
					// @ts-ignore
					solve({ status: false, data: '后端响应超时' })
				}
			}, options.timeout ?? 60_000)
		})
	}

	const m = (a: any, b: any) => `${a || b || ''}`
	function makeExecMethod<T>(command: string, errerHeader?: string, successHeader?: string) {
		return new Pipe(async (option: RequestOptions = {}) => {
			const { status, data, detail } = await exec<T>(command, option)
			if (!status) throw logger.warn(m(errerHeader, data), detail)
			logger.info(m(successHeader, option.msg))
			return data
		})
	}

	function makeExecCtx<T>(command: string, errerHeader?: string, successHeader?: string) {
		return new Pipe(async (option: RequestOptions) => {
			const { status, data, detail } = await exec<T>(command, option)
			if (!status) throw logger.warn(m(errerHeader, data), detail)
			logger.info(m(successHeader, option.msg))
			return [data, option] as const
		})
	}

	// 监听建立交流端口
	window.addEventListener('message', (ev) => {
		if (ev.data !== 'establish-port-pass') return
		port = ev.ports[0]
		port.addEventListener('message', (ev) => {
			const { id, res } = ev.data
			if (requestMap[id]) {
				requestMap[id](res)
				delete requestMap[id]
			}
		})
		port.start()
		clearQueue()
	})


	// 同步controller API 初始加载延时逻辑
	var CONTROLL_READY = false
	const execQueue: Function[] = []
	const clearQueue = () => {
		CONTROLL_READY = true
		execQueue.forEach(f => f())
		execQueue.splice(0)
	}

	return {
		exec,
		registerLog,
		makeExecMethod,
		makeExecCtx
	}
}

export const { exec, registerLog, makeExecMethod, makeExecCtx } = createAPI()

