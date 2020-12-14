<template>
  <div class="app-container">
    <el-form ref="newOrgNodeForm" :model="newOrgNodeData" label-position="left" label-width="90px">
      <el-form-item label="组织类型" v-if="newOrgNodeData.parentOrgType === 0" prop="orgType">
        <el-radio-group v-model="newOrgNodeData.orgType">
          <el-radio :label="0">公司</el-radio>
          <el-radio :label="1">部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="newOrgNodeData.orgType==organizationType.Corporation && selectedOrgData.parentId===0"
        label="公司类型"
        prop="corporationLevel"
      >
        <el-radio-group v-model="newOrgNodeData.corporationLevel">
          <el-radio :label="corporationLevel.TopCorporation">新公司</el-radio>
          <el-radio :label="corporationLevel.SubCorporation">子公司</el-radio>
        </el-radio-group>
      </el-form-item>      
      <el-form-item label="组织名称" prop="name">
        <el-input v-model="newOrgNodeData.name" placeholder="请输入组织名称" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Emitter from "@/mixins/emitter.js";
import {orgType, orgLevel, corporationLevel } from "@/utils";
export default {
  name: "CheckOrgType",
  mixins: [Emitter],
  props: {
    newOrgNodeData: {
      type: Object,
      default: () => {}
    },
    selectedOrgData: {
      type: Object,
      default: () => {}      
    }
  },
  data() {
    return {
      rules: {
        orgType: [
          { required: true, message: "请选择组织类型", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入组织名称", trigger: "blur" }
        ]
      },
      organizationType: orgType,
      corporationLevel: corporationLevel
    };
  }
};
</script>

<style>
</style>