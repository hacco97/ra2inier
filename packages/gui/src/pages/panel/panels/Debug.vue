<script lang='ts' setup>
import { useLogger } from '@/boot/logger';
import { DialogType, useDialogState } from '@/states/dialog';

const dialog = useDialogState()
const logger = useLogger('debug')

async function onAskClick() {
	const ret = await dialog.showDialog('你好吗？', DialogType.askIf)
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
	</div>
</template>

<style module scoped lang='scss'></style>
