<script lang='ts' setup>
import { reactive, ref, watch } from 'vue';

import { PanelParam } from '@/states/panelList';
import { useMemo } from '@ra2inier/core';
import { useArrayMap, useAsyncState, useMemoize } from '@vueuse/core';

const props = defineProps<{ param: PanelParam }>()

const list = ref(['123', '23', '132', '123'])

const f = useMemo(x => {
   console.log(x, 'create')
   return {
      name: x,
      age: Math.random()
   }
})

const list2 = useArrayMap(list, f.get)

</script>


<template>
   <div>
      <li v-for="(item, order) in list2" @click="list.splice(order, 1)">
         {{ item }}
      </li>
   </div>

</template>

<style module scoped lang='scss'></style>
