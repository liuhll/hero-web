<template>
  <div class="app-container">
    <el-form ref="newOrgNodeForm" :model="newOrgNodeData" label-position="left" label-width="90px">
      <el-form-item label="组织类型" v-if="newOrgNodeData.parentOrgType === 0" prop="orgType">
        <el-radio-group v-model="newOrgNodeData.orgType">
          <el-radio :label="0">公司</el-radio>
          <el-radio :label="1">部门</el-radio>
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
export default {
  name: "CheckOrgType",
  mixins: [Emitter],
  props: {
    newOrgNodeData: {
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
      }
    };
  }
};
</script>

<style>
</style>