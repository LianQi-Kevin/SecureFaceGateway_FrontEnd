<script setup lang="ts">
import {LeaveApplicationResponse} from "@/network/application";
import {getMyLeaveApplications} from "@/network/application";
const display = defineModel<boolean>('visible', {required: true, default: false});

const leaveApplications = ref<LeaveApplicationResponse[]>([])
onMounted(() => {
  getMyLeaveApplications().then(res => {
    leaveApplications.value = res
    console.debug(res)
  }).catch(err => {
    ElMessage({
      message: "获取请假审批清单失败，请联系管理员处理",
      type: "error"
    })
    console.error(err)
  })
})
</script>

<template>
  <el-dialog
    :before-close="() => {display = false}"
    :model-value="display"
    :destroy-on-clos="true"
    :close-delay="3"
    align-center
  >
    <div class="CardList">
      <template v-for="application in leaveApplications">
        <approval-card :application="application" />
      </template>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.CardList{
  margin: auto 20px auto 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  column-gap: 15px;
  column-count: 2;

  overflow-x: hidden;
  overflow-y: auto;
  gap: 5px;

  height: 80vh;
}

// 覆盖全局滚动条样式（仿 el-scrollbar）
::-webkit-scrollbar {
  width: 7px;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--el-scrollbar-bg-color, var(--el-text-color-secondary));
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}
</style>