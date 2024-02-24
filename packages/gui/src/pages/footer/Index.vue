<script lang='ts' setup>
import { ref } from 'vue'
import { statusText } from './state'
defineOptions({ name: 'Footer' })



</script>


<template>
   <div id="footer" :class="[$style.footer, $theme.footer]">
      <div>{{ statusText }}</div>
   </div>
</template>

<style scoped src="@css/footer.scss" module="$theme" />
<style scoped lang='scss' module>
.footer {
   height: 100%;
}
</style>
