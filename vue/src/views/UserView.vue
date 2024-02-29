<template>
  <div>
    <h2>用户列表</h2>
    <TableComp
      :tableData="users"
      :tableColumns="columns"
      :isLoading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
// import { shallowRef } from "vue";
import TableComp from "@/components/TableComp.vue";
import {
  Column,
  // ResPage,
  // User
} from "@/api/interface";
import { getUserList } from "@/api/modules/user";
import { useAsyncState } from "@vueuse/core";

const { state: users, isLoading } = useAsyncState(async () => {
  const res = await getUserList();
  return res.data;
}, undefined);
// let isLoading = true;
// const users = shallowRef<ResPage<User.UserList>>();

// getUserList().then((res) => {
//   users.value = res.data;
//   isLoading = false;
// });

const columns = [
  {
    prop: "_id",
    label: "ID",
  },
  {
    prop: "loginId",
    label: "登录名",
  },
  {
    prop: "name",
    label: "昵称",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "loves",
    label: "爱好",
  },
] as Column[];
</script>

<style scoped></style>
