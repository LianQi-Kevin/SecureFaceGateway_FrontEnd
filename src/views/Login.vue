<script setup lang="ts">
import {useRouter} from "vue-router";

const loginVisible = ref<boolean>(true)
const refreshLoginStatus = inject('refreshLoginStatus') as Function

const router = useRouter()
</script>

<template>
  <login-dialog v-model:visible="loginVisible" :submit-callable="() => {
    refreshLoginStatus();
    router.push('/controller')
  }"/>
</template>

<style scoped lang="scss">

</style>