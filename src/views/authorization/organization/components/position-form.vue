<template>
  <div class="form-container">
    <el-form ref="positionForm" label-position="left" label-width="120px" :model="position">
      <el-form-item label="岗位名称" prop="name" required>
        <el-input v-model="position.name" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="职能类型" prop="functionId" required>
        <el-select v-model="position.functionId" placeholder="请选择岗位职能">
          <!-- <el-option :label="" :value=""></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="岗位级别" prop="positionLevelId" required>
        <el-select v-model="position.positionLevelId" placeholder="请选择岗位级别">
          <!-- <el-option :label="" :value=""></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="岗位责任" prop="postResponsibility" required>
        <el-input v-model="position.postResponsibility" placeholder="请输入岗位责任" />
      </el-form-item>
      <el-form-item label="是否部门负责人">
        <el-radio-group v-model="position.isLeadershipPost">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否领导岗">
        <el-radio-group v-model="position.isLeadingOfficial">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "PositionForm",
  props: {
    position: {
      type: Object,
      default: () => {}
    }
  },
  data() {}
};
</script>
