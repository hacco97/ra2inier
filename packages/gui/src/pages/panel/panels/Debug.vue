<script lang='ts' setup>
import { useLogger } from '@/boot/logger';
import { DialogType, useDialogState } from '@/states/dialog';
import { useLocalStorage } from '@vueuse/core';

const dialog = useDialogState()
const logger = useLogger('debug')

async function onAskClick() {
	const ret = await dialog.showDialog('请输入字符串', DialogType.askFile)
	logger.debug(String(ret || 'false'))
}


</script>


<template>
	<div>
		<li>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti, tempore.
		</li>
		<li>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti, tempore.
		</li>
		<button @click="onAskClick">ask</button>
		<span>local:{{ }}</span>
	</div>
</template>

<style module scoped lang='scss'></style>
