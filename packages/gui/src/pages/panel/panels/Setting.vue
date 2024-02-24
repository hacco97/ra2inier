<script lang='ts' setup>
import Options from '@/components/Options.vue';
import { useConfig } from '@/stores/config';

defineOptions({ name: 'Setting' })
const config = useConfig()

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
   padding: 1em 0;

   li {
      padding: 0 1em;
   }

   footer {
      height: max(40%, 400px);
   }

   select {
      padding: 0 1em;
      @include normal-panel(normal);
   }
}
</style>
