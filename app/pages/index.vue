<template>
  <div>
    <!-- content -->
  </div>
</template>

<script setup>
 const router = useRouter()

 definePageMeta({
  layout: 'empty-layout'
});
onBeforeMount(() => {
   // Redirect to the dashboard on initial load
   navigateTo('/login')
 })
</script>


<style scoped>
</style>