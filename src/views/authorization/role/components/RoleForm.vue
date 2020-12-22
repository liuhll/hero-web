<template>
  <div class="form-container">
    <el-form
      ref="roleForm"
      label-position="left"
      label-width="120px"
      :model="role"
      :rules="rules"
      :disabled="dialogStatus === 'look'"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="role.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissionIds">
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
      <el-form-item label="数据权限" prop="dataPermissionType">
        <el-select
          v-model="role.dataPermissionType"
          placeholder="请选择该角色拥有的数据权限"
          style="width: 100%"
          @change="handleDataPermissionTypeChange"
        >
          <el-option
            v-for="item in dataPermissionTypes"
            :key="item.id"
            :label="item.description"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="自定义部门"
        prop="orgIds"
        v-if="role.dataPermissionType == 3"
      >
        <el-scrollbar style="height: 200px">
          <el-tree
            ref="orgTree"
            :data="orgData"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-checked-keys="role.orgIds"
            :props="orgIdProps"
            @check-change="handleCheckUserDefinedDataPermission"
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
        dataPermissionType: [
          {
            required: true,
            message: "请选择角色数据权限",
            trigger: "blur",
          },
        ],
        permissionIds: [
          {
            required: true,
            message: "请选择角色操作权限",
            trigger: "blur",
          },
          {
            required: true,
            message: "请选择角色操作权限",
            trigger: "change",
          },
        ],
        // orgIds: [
        //    {
        //     required: true,
        //     message: "请选择用户自定义数据权限的部门",
        //     trigger: "blur",
        //   },
        //   {
        //     required: true,
        //     message: "请选择用户自定义数据权限的部门",
        //     trigger: "change",
        //   },         
        // ]
      },
      permissionProps: {
        children: "children",
        label: "title",
      },
      orgIdProps: {
        children: "children",
        label: "name",
      },
      permissionData: [],
      orgData: [],
      dataPermissionTypes: [],
    };
  },
  mounted() {
    this.loadPermissionData();
    this.loadDataPermissionTypes();
    this.loadOrgData();
  },
  methods: {
    ...mapActions("menu", ["getTree", "getDataPermissionTypes"]),
    ...mapActions("organization", ["getOrgTree"]),
    loadPermissionData() {
      this.getTree().then((data) => {
        this.permissionData = data;
      });
    },
    loadDataPermissionTypes() {
      this.getDataPermissionTypes().then((data) => {
        this.dataPermissionTypes = data;
      });
    },
    loadOrgData() {
      this.getOrgTree().then((data) => {
        this.orgData = data;
      });
    },
    handleCheckPermission(node, checked, indeterminate) {
      this.role.permissionIds = this.$refs["permissionTree"].getCheckedKeys();
    },
    handleCheckUserDefinedDataPermission(node, checked, indeterminate) {
       this.role.orgIds = this.$refs["orgTree"].getCheckedKeys();
    },
    handleDataPermissionTypeChange(value) {
      if (value == 3) {
        this.role.orgIds = [];
      }
    },
  },
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