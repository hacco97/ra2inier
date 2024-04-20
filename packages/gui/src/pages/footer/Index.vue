<script lang='ts' setup>
import { useStatusState } from '@/states/status'
defineOptions({ name: 'Footer' })
const status = useStatusState()


</script>


<template>
	<div id="footer" :class="[$style.footer, $theme.footer]">
		<div>{{ status.statusText }}</div>
	</div>
</template>

<style scoped src="@css/footer.scss" module="$theme" />
<style scoped lang='scss' module>
.footer {
	height: 100%;
}
</style>
