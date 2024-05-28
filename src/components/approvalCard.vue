<script setup lang="ts">
import {LeaveApplicationResponse, updateLeaveApplicationStatus} from "@/network/application";
import type {userInfo} from "@/types/user";
import {getUserById} from "@/network/user";

interface propsType {
  title?: string
  application: LeaveApplicationResponse
}

const props = withDefaults(defineProps<propsType>(), {
  title: "请假审批"
});

const userInfo = reactive<userInfo>(<userInfo>{});
const DateRange = ref<[Date, Date]>([new Date(), new Date()]);

onMounted(() => {
  nextTick(() => {
    getUserById(props.application.user_id).then(res => {
      Object.assign(userInfo, res);
    }).catch(err => {
      console.error(err)
    })
  })
})

const activeNames = ref([])

function onApprove() {
  updateLeaveApplicationStatus(props.application.task_id, "approved").then(res => {
    console.debug(res)
    Object.assign(props.application, {status: "approved"})
  }).catch(err => {
    console.error(err)
  })
}

function onReject() {
  updateLeaveApplicationStatus(props.application.task_id, "rejected").then(res => {
    console.debug(res)
    Object.assign(props.application, {status: "rejected"})
  }).catch(err => {
    console.error(err)
  })
}
</script>

<template>
  <el-card class="Card" shadow="hover" >
    <template #header>
      <div class="card___header" style="display: flex; flex-direction: row; justify-content: space-between">
        <el-text size="large">{{props.title}}</el-text>
        <el-text size="large" type="info">{{new Date(props.application.create_time).toUTCString()}}</el-text>
        <el-tag type="warning" v-if="props.application.status === 'pending'">待审批</el-tag>
        <el-tag type="danger" v-else-if="props.application.status === 'rejected'">已拒绝</el-tag>
        <el-tag type="success" v-else-if="props.application.status === 'approved'">已批复</el-tag>
      </div>
    </template>
    <div class="Card__content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="展开详情" name="1">
          <el-form label-position="left" label-width="70px" v-model="userInfo">
            <el-form-item label="申请人">
              <el-input v-model="userInfo.username" readonly />
            </el-form-item>
            <el-form-item label="申请人ID">
              <el-input v-model="userInfo.user_id" readonly />
            </el-form-item>
          </el-form>
          <el-form label-position="left" label-width="70px" v-model="props.application">
            <el-form-item label="请假类型" v-if="false">
              <el-input v-model="props.title" readonly />
            </el-form-item>
            <el-form-item label="请假时间">
              <el-date-picker
                v-model="DateRange"
                :default-value="[new Date(application.start_time), new Date(application.end_time)]"
                type="datetimerange"
                readonly
                range-separator="至"
              />
            </el-form-item>
            <el-form-item label="请假原因">
              <el-input v-model="application.reason" readonly />
            </el-form-item>
            <el-form-item label="审批状态">
              <el-input v-model="application.status" readonly />
            </el-form-item>
            <el-form-item label-width="0">
              <div style="display: flex; justify-content: center; width: 100%">
                <el-button style="width: 100%" type="primary" plain @click="onApprove">审批</el-button>
                <el-button style="width: 100%" type="danger" plain @click="onReject">拒绝</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.Card {
  width: 31%;
  min-width: 530px;
}
</style>