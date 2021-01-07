<template>
  <div class="form-container">
    <el-form
      ref="tenantForm"
      label-position="left"
      label-width="140px"
      :model="tenant"
      :rules="rules"
      :disabled="dialogStatus === 'look'"
    >
      <el-form-item label="租户名称" prop="name">
        <el-input v-model="tenant.name" placeholder="请输入租户名称" />
      </el-form-item>
      <el-form-item label="对应顶级公司标识" prop="identification" v-if="dialogStatus==='create'">
        <el-input
          v-model="tenant.identification"
          placeholder="不少于四位英文或数字组合"
        />
      </el-form-item>
      <el-form-item label="是否初始化管理员" prop="createSuper" v-if="dialogStatus==='create'">
        <el-checkbox label="初始化管理员用户和角色" v-model="tenant.createSuper"></el-checkbox>
      </el-form-item>      
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="tenant.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  validateIdentification
} from "@/utils/validator";
export default {
  props: {
    tenant: {
      type: Object,
      default: () => {},
    },
    dialogStatus: String,
  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "租户名称不允许为空",
            trigger: "blur",
          },
        ],
        identification: [
          { required: true, message: "租户对应顶层公司标识不允许为空", trigger: "blur" },
          { trigger: "blur", validator: validateIdentification },
        ],
        
      },
    };
  },
};
</script>

<style>
</style>