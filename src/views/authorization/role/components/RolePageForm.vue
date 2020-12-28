<template>
  <div>
    <el-card>
      <el-form
        ref="role"
        label-width="110px"
        :model="role"
        :rules="rules"
        class="role"
      >
        <el-row :gutter="30">
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="角色基本信息">
              <el-col :span="12">
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="role.name" placeholder="请输入角色名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色标识" prop="identification">
                  <el-input
                    v-model="role.identification"
                    placeholder="不少于四位英文或数字组合"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属部门类型" prop="isAllOrg">
                  <el-select
                    v-model="role.isAllOrg"
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
              <el-col :span="12" v-if="role.isAllOrg == false">
                <el-form-item label="所属部门" prop="orgIds">
                  <el-cascader
                    :options="orgData"
                    :props="orgProps"
                    clearable
                    v-model="role.orgIds"
                    style="width: 100%"
                  ></el-cascader>
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
                      :default-checked-keys="role.permissionIds"
                      :props="permissionProps"
                      @check-change="handleCheckPermission"
                    >
                    </el-tree>
                  </el-scrollbar>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-row :gutter="24">
                  <el-col :span="24">
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
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      label="自定义部门"
                      prop="dataPermissionOrgIds"
                      v-if="role.dataPermissionType == 3"
                    >
                      <el-scrollbar style="height: 250px">
                        <el-tree
                          ref="orgTree"
                          :data="orgData"
                          show-checkbox
                          node-key="id"
                          :default-expand-all="true"
                          :default-checked-keys="role.dataPermissionOrgIds"
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
                <el-input type="textarea" v-model="role.memo" />
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
} from "@/utils/validator";
import { mapActions } from "vuex";
export default {
  name: "RolePageForm",
  props: {
    role: {
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
          { required: true, validator: validatePermissionIds, trigger: "blur" },
        ],
        identification: [
          { required: true, message: "标识不允许为空", trigger: "blur" },
          { trigger: "blur", validator: validateIdentification },
        ],
        isAllOrg: [
          {
            required: true,
            message: "角色所属部门类型不允许为空",
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
        emitPath: false
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
    this.loadOrgData();
    this.loadPermissionData();
    this.loadDataPermissionTypes();
  },
  methods: {
    ...mapActions("organization", ["getOwnOrgTree"]),
    ...mapActions("menu", ["getTree", "getDataPermissionTypes"]),
    loadOrgData() {
      this.getOwnOrgTree().then((data) => {
        this.orgData = data;
      });
    },
    handleIsAllOrgChange(val) {
      if (val) {
        this.role.orgIds = [];
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
      this.role.permissionIds = this.$refs["permissionTree"].getCheckedKeys();
    },
    handleCheckUserDefinedDataPermission(node, checked, indeterminate) {
      this.role.dataPermissionOrgIds = this.$refs["orgTree"].getCheckedKeys();
    },
    handleDataPermissionTypeChange(value) {
      if (value == 3) {
        this.role.dataPermissionOrgIds = [];
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