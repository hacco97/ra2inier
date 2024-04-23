import { useSingleton } from "@ra2inier/core"

/**
 * 建立与主线程的联系
 */
function createMasterApi() {
	/**
	 * 可执行的工作类型注册列表
	 */
	const worksMap: Record<string, Function> = {}

	/**
	 * 正在进行的请求列表
	 */
	const postMaps: Record<string, Function> = {}
	type Handler = (data: any) => any

	function deleteWork(command: string) {
		if (command in worksMap)
			delete worksMap[command]
	}

	/**
	 * 注册工作监听器
	 */
	function on(command: string, handler: Handler) {
		worksMap[command] = handler
	}

	function off(command: string, handler: Handler) {
		delete worksMap[command]
	}

	/**
	 * 向主线程发起请求
	 */
	function post<T>(channel: string, data: Record<string, any>) {
		return new Promise<ServResponse<T>>((solve) => {
			const postId = Math.random() + ''
			postMessage({
				id: postId,
				channel,
				data
			})
			postMaps[postId] = solve
		})
	}

	self.addEventListener('message', async (ev: MessageEvent) => {
		const { id, command, data, status } = ev.data
		if (command in worksMap) { // 处理主线程的请求
			const res: Record<string, any> = {
				id,
				data: `没有该命令（${command}）`,
				status: false
			}
			if (!(command in worksMap))
				return postMessage(res)
			try {
				res.data = await worksMap[command](data)
				res.status = true
			} catch (error) {
				res.data = error
			} finally {
				postMessage(res)
			}
		} else if (id in postMaps) { // 处理主线程的响应
			postMaps[id]({ data, status })
			delete postMaps[id]
		}
	})

	return {
		on,
		off,
		deleteWork,
		post
	}
}

export const useMasterAPI = useSingleton(createMasterApi)