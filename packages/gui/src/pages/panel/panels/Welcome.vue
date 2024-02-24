<script lang='ts' setup>
import { ref } from 'vue';


const msg = ref('welcomg to ra2inier')
</script>


<template>
   <div class="local-welcome scroll">
      {{ msg }}
   </div>
</template>

<style lang='scss' scoped>
.local-welcome {
   color: antiquewhite;
}
</style>
