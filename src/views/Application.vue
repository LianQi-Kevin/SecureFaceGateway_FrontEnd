<script setup lang="ts">
// 当前view应为应用中心，用以提供应用的入口, 当前仅为预约请假系统预留入口
import {Checked, Ticket} from "@element-plus/icons-vue";
import LeaveApplicationDialog from "@/components/leaveApplicationDialog.vue";
import approvalShowDialog from "@/components/approvalShowDialog.vue";

const leave_app_visible = ref<boolean>(false);
const approval_visible = ref<boolean>(false);
</script>

<template>
  <div class="context">
    <leave-application-dialog v-model:visible="leave_app_visible" />
    <approval-show-dialog v-model:visible="approval_visible" />
    <el-card class="application__card">
      <el-text size="large">审批</el-text>
      <el-divider />
      <div class="app_lists">
        <button class="app_item" @click="leave_app_visible = !leave_app_visible">
          <el-icon :size="30" class="icon"><Ticket /></el-icon>
          <el-text class="text">创建请假审批</el-text>
        </button>
        <button class="app_item" @click="approval_visible = !approval_visible">
          <el-icon :size="30" class="icon"><Checked /></el-icon>
          <el-text class="text">查看请假审批</el-text>
        </button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .application__card {

    //border: 1px solid var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);

    width: 80%;
    height: 80%;
    margin: 20px auto;

    .app_lists {
      display: flex;
      flex-direction: row;
      gap: 20px;
      flex-wrap: wrap;

      .app_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(255, 255, 255, 0%);
        border-radius: 20px;

        .icon {
          padding: 5px;
          border: 1px var(--el-text-color-primary) solid;
          border-radius: 10px;
        }

        .text {
          margin: 10px 0 0 0;
        }
      }
    }
  }
}
</style>