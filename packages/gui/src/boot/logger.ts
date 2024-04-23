import { LogLevel, Logger } from "@ra2inier/core";
import { globalEvent } from "./event";

export function useLogger(sender: string): Logger {
	const _s = (l: LogLevel, msg: string, remark?: any) => {
		if (!msg) return
		globalEvent.emit('renderer-message', sender, l, msg, remark)
	}
	return {
		debug(msg: string, remark?: any) {
			_s(LogLevel.debug, msg, remark)
		},
		info(msg: string, remark?: any) {
			_s(LogLevel.info, msg, remark)
		},
		warn(msg: string, remark?: any) {
			_s(LogLevel.warn, msg, remark)
		},
		error(msg: string, remark?: any) {
			_s(LogLevel.error, msg, remark)
		}
	}
}

export const theLogger = useLogger('nameless')

globalThis.theLogger=theLogger