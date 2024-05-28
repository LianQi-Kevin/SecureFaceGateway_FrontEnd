<script setup lang="ts">
import {getLeaveApplications, LeaveApplicationResponse} from "@/network/application";
import approvalCard from "@/components/approvalCard.vue";

const leaveApplications = ref<LeaveApplicationResponse[]>([])

onMounted(() => {
  getLeaveApplications().then(res => {
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
  <div class="content">
    <div class="CardList">
      <template v-for="application in leaveApplications">
        <approvalCard :application="application" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;

  .CardList{
    margin: auto 20px auto 20px;
    max-width: 100%;
    width: 100%;
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

    max-height: 90vh;
  }
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