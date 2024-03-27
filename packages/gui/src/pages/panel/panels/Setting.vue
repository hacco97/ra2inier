<script lang='ts' setup>
import Options from '@/components/Options.vue';
import { useConfigStore } from '@/stores/config';

defineOptions({ name: 'Setting' })
const { config } = useConfigStore()

// GPU逻辑

</script>


<template>
   <div :class="$style.setting" class="scroll">
      <li>
         <span>GPU加速</span><em>：</em>
         <Options :list="['yes', 'no']" v-model="config.GPU" :input="false"></Options>
      </li>
      <footer></footer>
   </div>
</template>

<style scoped lang='scss' module>
.setting {
   padding: align-size(large) 0;

   li {
      padding: 0 align-size(large);
   }

   footer {
      height: max(40%, 400px);
   }

   select {
      padding: 0 align-size(large);
      @include normal-panel(normal);
   }
}
</style>
