<template>
  <div class="form-container">
    <el-form
      ref="roleForm"
      label-position="left"
      label-width="90px"
      :model="role"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="name" required>
        <el-input v-model="role.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="状态" v-if="false">
        <el-switch v-model="role.status"></el-switch>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="role.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    role: {
        type:Object,
        default: () => {}
    },

  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "用户名不允角色名称不允许为空", trigger: "blur" }
        ]
      }
    };
  }
};
</script>
