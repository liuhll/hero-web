<template>
  <div class="form-container">
    <el-form
      ref="roleForm"
      label-position="left"
      label-width="90px"
      :model="role"
      :rules="rules"
      :disabled="dialogStatus === 'look'"
    >
      <el-form-item label="角色名称" prop="name" required>
        <el-input v-model="role.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissionIds" required>
        <el-scrollbar style="height: 300px">
          <el-tree
            ref="permissionTree"
            :data="permissionData"
            show-checkbox
            node-key="permissionId"
            :default-expand-all="true"
            :default-checked-keys="role.permissionIds"
            :props="permissionProps"
            @check-change="handleCheckPermission"
          >
          </el-tree>
        </el-scrollbar>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="role.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    role: {
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
            message: "角色名称不允许为空",
            trigger: "blur",
          },
        ],
      },
      permissionProps: {
        children: "children",
        label: "title",
      },
      permissionData: [],
    };
  },
  mounted() {
    this.loadPermissionData();
  },
  methods: {
    ...mapActions("menu", ["getTree"]),
    loadPermissionData() {
      this.getTree().then((data) => {
        this.permissionData = data;
      })
    },
    handleCheckPermission(node, checked, indeterminate) {
      this.role.permissionIds = this.$refs["permissionTree"].getCheckedKeys();
    }
  }
};
</script>

<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-scrollbar__bar.is-horizontal {
  display: none;
}
</style>