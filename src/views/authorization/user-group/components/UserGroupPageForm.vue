<template>
  <div>
    <el-card>
      <el-form
        ref="userGroup"
        label-width="110px"
        :model="userGroup"
        :rules="rules"
        class="userGroup"
      >
        <el-row :gutter="30">
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="用户组基本信息">
              <el-col :span="12">
                <el-form-item label="用户组名称" prop="name">
                  <el-input
                    v-model="userGroup.name"
                    placeholder="请输入用户组名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户组标识" prop="identification">
                  <el-input
                    v-model="userGroup.identification"
                    placeholder="不少于四位英文或数字组合"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属部门类型" prop="isAllOrg">
                  <el-select
                    v-model="userGroup.isAllOrg"
                    style="width: 100%"
                    @change="handleIsAllOrgChange"
                  >
                    <el-option
                      key="1"
                      label="所有部门"
                      :value="true"
                    ></el-option>
                    <el-option
                      key="0"
                      label="自定义部门"
                      :value="false"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="userGroup.isAllOrg == false">
                <el-form-item label="所属部门" prop="orgIds">
                  <el-cascader
                    :options="orgData"
                    :props="orgProps"
                    clearable
                    v-model="userGroup.orgIds"
                    style="width: 100%"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-tab-pane>
          </el-tabs>
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="角色信息">
              <el-col :span="24">
                <el-form-item prop="roleIds" label="角色">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="请输入关键字查找要可以添加的角色"
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
              </el-col>
            </el-tab-pane>
          </el-tabs>
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="权限信息">
              <el-col :span="12">
                <el-form-item label="操作权限" prop="permissionIds">
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
              </el-col>
              <el-col :span="12" v-if="userGroup.permissionIds.length > 0">
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-form-item label="数据权限" prop="dataPermissionType">
                      <el-select
                        v-model="userGroup.dataPermissionType"
                        placeholder="请选择该用户组拥有的数据权限"
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
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="自定义部门"
                      prop="dataPermissionOrgIds"
                      v-if="userGroup.dataPermissionType == 3"
                    >
                      <el-scrollbar style="height: 250px">
                        <el-tree
                          ref="orgTree"
                          :data="orgData"
                          show-checkbox
                          node-key="id"
                          :default-expand-all="true"
                          :default-checked-keys="userGroup.dataPermissionOrgIds"
                          :props="orgIdProps"
                          @check-change="handleCheckUserDefinedDataPermission"
                        >
                        </el-tree>
                      </el-scrollbar>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-tab-pane>
          </el-tabs>
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="备注信息">
              <el-form-item label="备注" prop="memo">
                <el-input type="textarea" v-model="userGroup.memo" />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  validateIdentification,
  validatePermissionIds,
  validateOrgIds,
  validateRoleIds,
} from "@/utils/validator";
import { mapActions } from "vuex";
export default {
  name: "UserGroupPageForm",
  props: {
    userGroup: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "用户组名称不允许为空",
            trigger: "blur",
          },
        ],
        dataPermissionType: [
          {
            required: true,
            message: "请选择用户组数据权限",
            trigger: "blur",
          },
        ],
        identification: [
          { required: true, message: "标识不允许为空", trigger: "blur" },
          { trigger: "blur", validator: validateIdentification },
        ],
        isAllOrg: [
          {
            required: true,
            message: "用户组所属部门类型不允许为空",
            trigger: "change",
          },
        ],
        orgIds: [
          {
            required: true,
            validator: validateOrgIds,
            trigger: "change",
          },
          {
            required: true,
            validator: validateOrgIds,
            trigger: "blur",
          },
        ],
        dataPermissionOrgIds: [
          {
            required: true,
            validator: validateOrgIds,
            trigger: "change",
          },
          {
            required: true,
            validator: validateOrgIds,
            trigger: "blur",
          },
        ],
      },
      orgProps: {
        multiple: true,
        checkStrictly: true,
        label: "title",
        value: "id",
        emitPath: false,
      },
      permissionProps: {
        children: "children",
        label: "title",
      },
      orgIdProps: {
        children: "children",
        label: "name",
      },
      loading: false,
      permissionData: [],
      orgData: [],
      dataPermissionTypes: [],
      roles: [],
      queryRole: {
        searchKey: undefined,
        status: 1,
        pageCount: 50,
        pageIndex: 1,
      },
    };
  },
  watch: {
    "userGroup.permissionIds": {
      handler(newval, oldval) {
        if (newval != oldval && newval.length <= 0) {
          this.userGroup.dataPermissionType = null;
        }
      },
      immediate: false,
    },
    "userGroup.isAllOrg": {
      handler(newval, oldval) {
        if (newval != oldval && oldval != undefined) {
          if (newval) {            
            this.userGroup.roleIds = [];
            this.queryRole.orgIds = null;
            this.loadRoleData();
          } else if (!newval) {
            this.userGroup.orgIds = [];
            this.userGroup.roleIds = [];
            this.roles = [];
          }
        }
      },
      immediate: false,
    },
    "userGroup.orgIds": {
      handler(newval, oldval) {
        if (newval != oldval && oldval != undefined) {
          if (newval && newval.length > 0) {
            if (oldval != undefined) {
              this.userGroup.roleIds = [];
              this.queryRole.orgIds = newval;
              this.loadRoleData();
            }
          } else if (this.userGroup.isAllOrg) {
            if (oldval != undefined) {
              this.userGroup.roleIds = [];
              this.queryRole.orgIds = null;
              this.loadRoleData();
            }
          } else {
            this.roles = [];
          }
        }
      },
      immediate: false,
    },
  },
  mounted() {
    this.loadOrgData();
    this.loadPermissionData();
    this.loadDataPermissionTypes();
  },
  methods: {
    ...mapActions("role", ["list", "search"]),
    ...mapActions("organization", ["getOwnOrgTree"]),
    ...mapActions("menu", ["getTree", "getDataPermissionTypes"]),
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
    loadOrgData() {
      this.getOwnOrgTree().then((data) => {
        this.orgData = data;
      });
    },
    handleIsAllOrgChange(val) {
      if (val) {
        this.userGroup.orgIds = [];
      }
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
    handleCheckPermission(node, checked, indeterminate) {
      this.userGroup.permissionIds = this.$refs[
        "permissionTree"
      ].getCheckedKeys();
    },
    handleCheckUserDefinedDataPermission(node, checked, indeterminate) {
      this.userGroup.dataPermissionOrgIds = this.$refs[
        "orgTree"
      ].getCheckedKeys();
    },
    handleDataPermissionTypeChange(value) {
      if (value == 3) {
        this.userGroup.dataPermissionOrgIds = [];
      }
    },
    searchRoles(key) {
      if (key !== "") {
        this.queryRole.searchKey = key;
      }

      if (
        this.userGroup.isAllOrg == undefined ||
        this.userGroup.isAllOrg == null
      ) {
        this.$message.error("请先选择用户组所属部门类型");
        return;
      }
      if (
        this.userGroup.isAllOrg == false &&
        (!this.userGroup.orgIds || this.userGroup.orgIds.length <= 0)
      ) {
        this.$message.error("请先选择用户组的部门");
        return;
      }
      if (this.userGroup.isAllOrg == false) {
        this.queryRole.orgIds = this.userGroup.orgIds;
      }
      this.loadRoleData();
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