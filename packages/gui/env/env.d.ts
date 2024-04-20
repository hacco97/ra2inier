
/// <reference types="vite/client" />
/// <reference types="view-transitions-api-types" />

import { ProjectVo } from "@ra2inier/core"
import { BrowserWindow } from "electron"

interface ImportMetaEnv {
	readonly VITE_DEV_SERVER_URL?: string,
	readonly VITE_APP_NAME: string,
	readonly VITE_DIST: string,
	readonly VITE_PROTOCOL: string,
	readonly VITE_VUE_DEVTOOLS: string,
	readonly VITE_MAIN_PARTITION: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare global {

	interface ServResponse<T> {
		[key: string]: any
		status: boolean
		data: T
		_isServResponse: true
	}

	interface RequestOptions {
		[key: string]: any
		command?: string,
		timeout?: number,
		data?: any,
		window?: BrowserWindow,
		projectPath?: string,
		reject?: <T>(res: T) => ServResponse<T>
	}

	type RejectHandle = (reason: any) => ServResponse<any>


	var projectVo: ProjectVo | undefined
}

