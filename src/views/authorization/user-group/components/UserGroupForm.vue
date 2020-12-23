<template>
  <div class="form-container">
    <el-form
      ref="userGroupForm"
      label-position="left"
      label-width="120px"
      :model="userGroup"
      :rules="rules"
      :disabled="dialogStatus === 'look'"
    >
      <el-form-item label="用户组名" prop="name">
        <el-input v-model="userGroup.name" placeholder="请输入用户组名" />
      </el-form-item>
      <el-form-item label="用户组标识" prop="identification">
        <el-input
          v-model="userGroup.identification"
          placeholder="不少于四位英文或数字组合"
        />
      </el-form-item>
      <el-form-item prop="roleIds" label="角色">
        <el-tooltip
          class="item"
          effect="dark"
          content="请输入关键字查找要添加的角色"
          placement="top-start"
        >
          <el-select
            v-model="userGroup.roleIds"
            multiple
            clearable
            filterable
            remote
            :loading="loading"
            :remote-method="searchRoles"
            style="width: 100%"
            placeholder="请输入要添加的角色名称"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="权限" prop="permissionIds">
        <el-scrollbar style="height: 300px">
          <el-tree
            ref="permissionTree"
            :data="permissionData"
            show-checkbox
            node-key="permissionId"
            :default-expand-all="true"
            :default-checked-keys="userGroup.permissionIds"
            :props="permissionProps"
            @check-change="handleCheckPermission"
          >
          </el-tree>
        </el-scrollbar>
      </el-form-item>
      <el-form-item
        label="数据权限"
        prop="dataPermissionType"
        v-if="userGroup.permissionIds.length > 0"
      >
        <el-select
          v-model="userGroup.dataPermissionType"
          placeholder="该用户组指定的权限拥有的数据权限"
          style="width: 100%"
          clearable
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
        v-if="userGroup.dataPermissionType == 3"
      >
        <el-scrollbar style="height: 180px">
          <el-tree
            ref="orgTree"
            :data="orgData"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-checked-keys="userGroup.orgIds"
            :props="orgIdProps"
            @check-change="handleCheckUserDefinedDataPermission"
          >
          </el-tree>
        </el-scrollbar>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="userGroup.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { validateIdentification } from "@/utils/validator";
export default {
  name: "UserGroupForm",
  props: {
    userGroup: {
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
            message: "用户组名不允许为空",
            trigger: "blur",
          },
        ],
        identification: [
          { required: true, message: "标识不允许为空", trigger: "blur" },
          { trigger: "blur", validator: validateIdentification },
        ],
        dataPermissionType: [
          {
            required: true,
            message: "请选择角色数据权限",
            trigger: "blur",
          },
        ],
      },
      loading: false,
      roles: [],
      permissionData: [],
      permissionProps: {
        children: "children",
        label: "title",
      },
      queryRole: {
        searchKey: undefined,
        status: 1,
        pageCount: 10,
        pageIndex: 1,
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
  watch: {
    "userGroup.permissionIds": {
      handler(newval,oldval) {
        if (newval != oldval && newval.length <= 0) {
          this.userGroup.dataPermissionType = null;
        } 
      },
      immediate: false,
    },
  },
  mounted() {
    this.loadPermissionData();
    this.loadDataPermissionTypes();
    this.loadOrgData();
  },
  methods: {
    ...mapActions("role", ["list", "search"]),
    ...mapActions("menu", ["getTree", "getDataPermissionTypes"]),
    ...mapActions("organization", ["getOrgTree"]),
    loadRoleData() {
      this.list().then((data) => {
        this.roles = data;
      });
    },
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
    searchRoles(key) {
      if (key !== "" || !this.userGroup.roleIds) {
        this.queryRole.searchKey = key;
        this.loadRoleData();
      }
    },
    loadRoleData() {
      this.loading = true;
      this.search(this.queryRole).then((data) => {
        this.totalCount = data.totalCount;
        this.roles = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false;
        }, 1.5 * 200);
      });
    },
    handleCheckPermission(node, checked, indeterminate) {
      this.userGroup.permissionIds = this.$refs[
        "permissionTree"
      ].getCheckedKeys();
    },
    handleCheckUserDefinedDataPermission(node, checked, indeterminate) {
      this.userGroup.orgIds = this.$refs["orgTree"].getCheckedKeys();
    },
    handleDataPermissionTypeChange(value) {
      if (value == 3) {
        this.userGroup.orgIds = [];
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