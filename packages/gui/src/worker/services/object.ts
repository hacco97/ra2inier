import { fromRaw, IniObject, IniObjectRo, isUniqueObject, MapperRo, useEffect, WordValidity } from '@ra2inier/core';
import { useLogger, useMasterAPI } from '../apis';
import { useProject } from '../boot';
import { checkWordHook, createCtx, doTranslateObject } from '../lib';


/**
 * 注册对象处理相关逻辑
 */
function createObjectHandlers() {

	const { on } = useMasterAPI()
	const { setValue, objects } = useProject()
	const logger = useLogger()

	// 对象同步
	on('object/sync', async ({ data }: { data: IniObject[] }) => {
		for (let object of data) {
			if (!isUniqueObject(object)) continue
			const tmp = fromRaw(object, IniObjectRo)
			setValue('objects', tmp.key, tmp)
		}
	})

	// 翻译一个对象
	on('object/translate', async ({ objectKey }: { objectKey: string }) => {
		const object = objects[objectKey]
		const ret = doTranslateObject(object, dictionary)
		return ret
	})


	const { dictionary } = useProject()
	// 单词条校验逻辑
	on('word/validate', (info: { wordKey: string, values: string[] }) => {
		const { wordKey, values } = info
		// 在本地字典中寻找目标的word
		const word = dictionary[wordKey], validity = new WordValidity
		checkWordHook(word)
		if (word.hooks.validate) {
			try { return word.hooks.validate(values, createCtx(logger)) ?? validity }
			catch (e: any) { logger.error(`执行${word.fullname}的"validate hook"时出错`, e?.stack || e) }
		}
		return validity
	})

	// 同步单个mapper
	on('mapper/sync', (mapper: MapperRo) => {
		// mappers[mapper.key] = mapper
		setValue('mappers', mapper.key, mapper)
	})

	return [0, () => { }] as [number, any]
}

export const useObjectHandlers = useEffect(createObjectHandlers)