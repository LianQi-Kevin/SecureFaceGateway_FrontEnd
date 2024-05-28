<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";

const loginVisible = ref<boolean>(true)
const refreshLoginStatus = inject('refreshLoginStatus') as Function

const router = useRouter()
const route = useRoute()

onMounted(() => {
  loginVisible.value = true
})
</script>

<template>
  <login-dialog v-model:visible="loginVisible" :submit-callable="() => {
    refreshLoginStatus();
    router.push(route.query.redirect as string || '/')
  }"/>

  <el-button v-show="!loginVisible" plain type="warning" class="warning_btn" size="large" @click="loginVisible = true">
    当前页面需要登录后使用，请点击登录
  </el-button>
</template>

<style scoped lang="scss">
.warning_btn {
  margin: auto auto;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  box-shadow: var(--el-box-shadow-dark);
}
</style>