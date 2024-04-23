import { useSingleton } from "@ra2inier/core"
import { useLogger } from "./log"

/**
 * 建立worker到后端的直接交流通道
 */
function createBackendApi() {
	let port: MessagePort
	const postMapsBackend: Record<string, Function> = {}
	const logger = useLogger()

	self.addEventListener('message', function establishPort(ev: MessageEvent) {
		if (!(ev.ports[0] && ev.data === 'pass port to worker')) return
		port = ev.ports[0]
		self.removeEventListener('message', establishPort)
		port.addEventListener('message', (ev) => {
			const { id, res } = ev.data
			if (postMapsBackend[id]) {
				postMapsBackend[id](res)
				delete postMapsBackend[id]
			}
		})
		port.start()
	})

	function exec<T>(command: string, options: RequestOptions = {}) {
		return new Promise<ServResponse<T>>((solve) => {
			const id = Math.random() + ''
			try {
				const tmp = options.data
				if (tmp && tmp.toDto) options.data = tmp.toDto()
				port.postMessage({ id, command, options })
			}
			catch (error) {
				logger.error('命令发送失败', {
					command,
					error,
					options
				})
			}
			postMapsBackend[id] = solve
			setTimeout(() => {
				if (postMapsBackend[id]) {
					delete postMapsBackend[id]
					// @ts-ignore
					solve({ status: false, data: 'timeout' })
				}
			}, options.timeout ?? 60_000)
		})
	}

	return {
		exec
	}
}

export const useBackendAPI = useSingleton(createBackendApi)