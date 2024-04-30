<script setup lang="ts">
import {getUserAvatarById, getAllUsers, createUser, deleteUser} from "@/network/user";
import type {dataFrameRow, userInfo} from "@/types/user";
import UserAppendDialog, {OmitedCreateRow} from "@/components/userAppendDialog.vue";
import {ElTable} from "element-plus";

const appendVisible = ref<boolean>(false)
const passwordChangeVisible = ref<boolean>(false)
const passwordChangeUserID = ref<string>('')
const singleTableRef = ref<InstanceType<typeof ElTable>>()


// 获取用户信息
const tableData = ref<dataFrameRow[]>([]);

onMounted(async () => {
  // 获取用户信息
  const data = await getAllUsers();
  // 获取用户头像
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let avatar_url = "#";
    try {
      avatar_url = await getUserAvatarById(item.user_id);
    } catch (e) {
      console.error(e);
    }
    tableData.value.push({
      avatar: avatar_url,
      ...item,
    });
  }
  console.debug(tableData.value)
});

function onAppendSubmit(user_info_: OmitedCreateRow) {
  const user_info = toRaw(user_info_)
  console.log(user_info)
  // 请求后端添加用户
  createUser(
    user_info.username,
    user_info.password,
    user_info.role,
    user_info.face_image
  ).then((res: userInfo) => {
    tableData.value.push({
      avatar: user_info.avatar,
      ...res
    })
  }).catch((e) => {
    console.log(e)
  })

  // 关闭dialog
  appendVisible.value = false;
}


function deleteUserAction(user_info: dataFrameRow) {
  const data = toRaw(user_info) as dataFrameRow
  console.log(data)
  // 请求后端删除用户
  deleteUser(data.user_id).then(() => {
    const index = tableData.value.findIndex((item) => item.user_id === data.user_id)
    tableData.value.splice(index, 1)
  }).catch((err) => {
    console.log(err)
  })
}

function onPasswordChange(row: dataFrameRow) {
  passwordChangeUserID.value = row.user_id
  passwordChangeVisible.value = true
}
</script>

<template>
  <user-append-dialog v-model:visible="appendVisible" @on-submit="onAppendSubmit"/>
  <pwd-change-dialog v-model:visible="passwordChangeVisible" @on-submit="passwordChangeVisible = false" :userID="passwordChangeUserID"/>
  <div class="content">
    <div class="table__controller">
      <el-button type="primary" plain @click="() => {appendVisible = true}">添加用户</el-button>
    </div>
    <div class="table__area">
      <el-table :data="tableData" stripe border :table-layout="'auto'" max-height="600" ref="singleTableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" fixed />
        <el-table-column prop="user_id" label="用户ID" show-overflow-tooltip />
        <el-table-column prop="role" label="权限组" />
        <el-table-column prop="disabled" label="账号已禁用" >
          <template #default="{row}">
            <el-switch v-model="row.disabled" />
          </template>
        </el-table-column>
        <el-table-column prop="avatar" label="Face-Image">
          <template #default="{row}">
            <el-image :src="row.avatar" style="width: 50px; height: 50px; border-radius: 50%"
                      :preview-src-list="[row.avatar]" :close-on-press-escape="true"/>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button size="default" disabled plain v-if="false">编辑</el-button>
            <el-button size="default" plain @click="onPasswordChange(row)">修改密码</el-button>
            <el-button size="default" type="danger" plain @click="deleteUserAction(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


  .table__controller {
    margin-top: 10px;
    width: 100%;
    max-width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .table__area {
    margin-top: 20px;
    width: 100%;
    max-width: 90%;
  }
}

</style>