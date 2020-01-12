<template>
  <div class="form-container">
    <el-form ref="positionForm" 
    label-position="left" 
    label-width="90px" 
    :model="position">
      <el-form-item label="岗位名称" prop="name" required>
        <el-input  placeholder="请输入岗位名称" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      default: () => {}
      
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>