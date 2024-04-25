<script lang='ts' setup>
import { useLogger } from '@/boot/logger';
import { DialogType, useDialogState } from '@/states/dialog';

const dialog = useDialogState()
const logger = useLogger('debug')

async function onAskClick() {
	const ret = await dialog.showDialog('请输入字符串', DialogType.askIf)
	logger.debug(String(ret || 'false'))
}


</script>


<template>
	<div :class="$style.debug">
		<li>lorem</li>
		<li>lorem</li>
		<li>lorem</li>
		<li>lorem</li>
		<li>lorem</li>
		<li>lorem</li>
	</div>
</template>

<style module scoped lang='scss'>
.debug {
	display: block;
	overflow: hidden;
	background-color: aqua;

	li {
		/* display: inline-block; */
		float: left;
		background-color: red;
		margin: 20px 20px;
	}
}
</style>
