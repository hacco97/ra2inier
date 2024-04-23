<script lang='ts' setup>
import { ReferItem } from "@/stores/projectStore"
import { UniqueObject } from "@ra2inier/core";
interface Prop { item: ReferItem }
defineProps<Prop>()

</script>

<template>
	<div>
		<p>{{ item.name }}</p>
		<p>
			<span>更新时间：</span>
			<span>{{ UniqueObject.getVString(item.version) }}</span>
		</p>
		<p>
			<span>本地路径：</span>
			<file-link style="height: fit-content;" :path="item.path" class="link">
				{{ item.path || '?' }}
			</file-link>
		</p>
		<p>
			<span>仓库链接：</span>
			<a :href="item.url" class="link">
				{{ (item.url && item.url.startsWith('https://github.com')) ? item.url : '?' }}
			</a>
		</p>
	</div>
</template>

<style module scoped lang='scss'></style>
