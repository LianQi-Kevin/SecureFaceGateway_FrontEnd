<script setup lang="ts">
import { Moon, Search, Setting, Sunny } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {useDark, useStorage, useToggle} from '@vueuse/core'
import {getUserInfo} from "@/network/user";
import type { userInfo } from "@/types/user";

const router = useRouter();
const isDark = useDark();
const toggleDark = useToggle(isDark);

const loginVisible = ref<boolean>(false);
const loggedIn = ref<boolean>(false);
const user_info = ref<userInfo>();

const showUserInfo = ref<boolean>(false);

provide("loginBoxVisible", loginVisible);
provide("loggedIn", loggedIn);

function refreshLoginStatus() {
  const userInfo_ = localStorage.getItem("userInfo");
  const access_token = localStorage.getItem("access_token");

  if (userInfo_ && access_token) {
    loggedIn.value = true;
  } else if (!userInfo_ && access_token) {
    // 获取用户信息
    getUserInfo().then((res) => {
      user_info.value = res;
      useStorage("user_info", res)
      console.debug(user_info.value)

      loggedIn.value = true;
    }).catch(err => {
      console.error(err)
      ElMessage.error("获取用户信息失败")
    })

  } else {
    loggedIn.value = false;
  }
}
provide('refreshLoginStatus', refreshLoginStatus)

onMounted(() => {
  nextTick(refreshLoginStatus)
})
</script>

<template>
  <login-dialog v-model:visible="loginVisible" :submit-callable="refreshLoginStatus"/>
  <user-info-dialog v-model:visible="showUserInfo" :user_info="user_info as userInfo"/>
  <div class="content">
    <div class="home__header">
      <el-button class="title_text" @click="router.push('/')" text>智能门禁系统</el-button>
      <div class="router_class">
        <el-button class="detect" link size="large" @click="() => {router.push('/detect')}">
          <el-icon class="tab__icon"><Search /></el-icon>
          人脸识别
        </el-button>
        <el-button class="controller" link size="large" @click="() => {router.push('/controller')}">
          <el-icon class="tab__icon"><Setting /></el-icon>
          数据管理
        </el-button>
      </div>

      <el-button @click="toggleDark()" plain style="margin-right: 15px">
        <el-icon v-if="isDark" size="15" style="margin-right: 5px"><Moon /></el-icon>
        <el-icon v-else size="15" style="margin-right: 5px"><Sunny /></el-icon>
        {{ isDark ? "Dark" : "Light" }}
      </el-button>

      <el-button v-if="loggedIn" @click="() => {showUserInfo = true}" link>
        <template #default>
          <el-avatar v-if="loggedIn" shape="square" :size="30" class="user__avatar">
            {{user_info?.username.slice(0, 3)}}
          </el-avatar>
        </template>
      </el-button>

      <el-button class="login" @click="() => {loginVisible = true}" v-if="!loggedIn">登录</el-button>
    </div>
    <div class="home__main">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 100vw;
  display: flex;
  flex-direction: column;
}
.home__header {
  width: 100%;
  height: 50px;
  margin: 0;
  box-sizing: border-box;
  padding: 5px 20px;

  border-bottom: #747bff 1px solid;

  display: flex;
  flex-direction: row;
  //justify-content: space-between;
  align-items: center;

  .title_text {
    font-size: 27px;
    font-weight: bold;

    margin:  0 40px 0 0;
  }

  .router_class {
    height: 100%;

    margin-bottom: 5px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: flex-end;

    flex-grow: 1;

    .tab__icon {
      margin-right: 5px;
    }

    .detect {
      margin: 0 20px 0 0;
      font-size: 15px;
    }

    .controller {
      margin: 0;
      font-size: 15px;
    }

  }
}

.home__main {
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  padding: 0;
}
</style>
