<script lang='ts' setup>
import HomeLayout from './Layout.vue'
import Menu from '@/pages/menu/Index.vue'
import LeftTab from '@/pages/leftTab/Index.vue'
import Panel from '@/pages/panel/Index.vue'
import FootTab from '@/pages/footTab/Index.vue'
import Footer from '@/pages/footer/Index.vue'
defineOptions({ name: 'Home' })

</script>


<template>
   <HomeLayout>
      <template #header>
         <Menu />
      </template>
      <template #leftSide>
         <LeftTab />
      </template>
      <template #main>
         <Panel />
      </template>
      <template #footSide>
         <FootTab />
      </template>
      <template #footer>
         <Footer />
      </template>
   </HomeLayout>
</template>
