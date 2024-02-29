<template>
  <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
    <el-table-column 
      v-for="(item, index) in tableColumns"
      :key="index"
      :prop="item.prop"
      :label="item.label" 
    >
      <template v-if="item.prop === 'loves'" #default="scope">
        <el-tag
          v-for="(love,i) in scope.row.loves"
          :type="i % 2 === 0 ? '' : 'success'"
          disable-transitions
          :key="i"
        >{{ love }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {User,Column,ResPage} from '@/api/interface';
import { PropType } from 'vue';

defineProps({
  tableData: {
    type: Object as () => (ResPage<User.UserList> | undefined),
    default: () => [],
  },
  tableColumns: {
    type: Array as PropType<Column[]|undefined>,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
});
</script>