<script lang='ts' setup>
</script>

<template>
	<div :class="$style.none">
		<div id="hero">
		</div>
	</div>
</template>

<style scoped lang='scss' module>
.none {
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	min-height: 0;
	min-width: 0;

	>div {
		width: 50%;
		min-width: 100px;
		max-width: 400px;
		aspect-ratio: 1;
		@include plane-radius(big);
		background: heroicon();
	}
}
</style>
