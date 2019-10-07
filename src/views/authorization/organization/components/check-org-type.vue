<template>
  <div class="app-container">
    <el-form :model="checkOrgType" label-position="left" label-width="90px">
      <el-form-item label="组织类型">
        <el-radio-group v-model="checkOrgType.orgType">
          <el-radio :label="0">公司</el-radio>
          <el-radio :label="1">部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="组织名称">
        <el-input v-model="checkOrgType.name" placeholder="请输入组织名称" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Emitter from "@/mixins/emitter.js";
export default {
  name: "CheckOrgType",
  mixins: [Emitter],
  data() {
    return {
      checkOrgType: {
        orgType: -1,
        name: ""
      }
    };
  },
  methods: {
    handleCheckOrgType() {
      this.$emit("on-checked-orgtype", this.checkOrgType);
    },
    reSetOrgType() {
      this.orgType = -1;
    }
  }
};
</script>

<style>
</style>