import { LogLevel, Logger, useSingleton } from '@ra2inier/core';
import { useMasterAPI } from './master';

/**
 * 向主线程发送日志
 */
export function createLogger(): Logger {
	const { post } = useMasterAPI()
	const channel = 'send-log'
	return {
		debug(msg: string, remark?: any) {
			post(channel, { msg, remark, level: LogLevel.debug })
		},
		info(msg: string, remark?: any) {
			post(channel, { msg, remark, level: LogLevel.info })
		},
		warn(msg: string, remark?: any) {
			post(channel, { msg, remark, level: LogLevel.warn })
		},
		error(msg: string, remark?: any) {
			post(channel, { msg, remark, level: LogLevel.error })
		}
	}
}

export const useLogger = useSingleton(createLogger)
