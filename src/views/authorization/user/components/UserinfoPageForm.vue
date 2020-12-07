<template>
  <div>
    <el-card>
      <el-form
        ref="userInfo"
        label-width="120px"
        :model="userInfo"
        :rules="rules"
      >
        <el-row :gutter="30">
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="用户基本信息">
              <el-col :span="12">
                <el-form-item label="用户名" prop="userName" required>
                  <el-input
                    v-model="userInfo.userName"
                    placeholder="请输入用户名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="中文名" prop="chineseName" required>
                  <el-input
                    v-model="userInfo.chineseName"
                    placeholder="请输入中文名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机" prop="phone" required>
                  <el-input
                    v-model="userInfo.phone"
                    placeholder="请输入手机号码"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮件" prop="email" required>
                  <el-input
                    v-model="userInfo.email"
                    placeholder="请输入电子邮件"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="所属部门"
                  prop="orgId"
                  placeholder="请选择所属部门"
                  required
                >
                  <el-cascader
                    v-model="userInfo.orgId"
                    :options="orgData"
                    :props="{
                      expandTrigger: 'hover',
                      label: 'name',
                      value: 'id',
                      emitPath: false,
                      children: 'children',
                    }"
                    clearable
                    placeholder="请选择所属部门"
                    filterable
                    size="small"
                    style="width: 100%; float: left; padding: 2px 0"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="职位"
                  prop="positionId"
                  placeholder="请选择职位"
                  required
                >
                  <el-select
                    v-model="userInfo.positionId"
                    style="width: 100%; float: left; padding: 2px 0"
                  >
                    <el-option
                      v-for="item in deptPositions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { isEmpty } from "@/utils";
import { mapActions } from "vuex";
export default {
  name: "UserinfoPageForm",
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    "userInfo.orgId": {
      handler(newOrgId, oldOrgId) {
        this.userInfo.positionId = null;
        if (newOrgId && oldOrgId !== newOrgId) {
          this.loadDeptPosition(newOrgId);
        } else {
          this.deptPositions = [];
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      orgData: [],
      deptPositions: [],
      roles: [],
      rules: {
        userName: [
          { required: true, message: "用户名不允许为空", trigger: "blur" },
          {
            type: "regexp",
            pattern: "[a-zA-Z0-9_-]{4,16}$",
            message: "用户名格式不正确",
            trigger: "blur",
          },
        ],
        chineseName: [
          { required: true, message: "中文名称不允许为空", trigger: "blur" },
          {
            type: "string",
            max: 50,
            message: "长度不允许超过50个字符",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "手机号码不允许为空", trigger: "blur" },
          {
            type: "regexp",
            pattern:
              "^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$",
            message: "长度不允许超过50个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "电子邮件不允许为空", trigger: "blur" },
          {
            type: "email",
            message: "电子邮件格式不正确",
            trigger: "change",
          },
        ],
        orgId: [
          { required: true, message: "部门信息不允许为空", trigger: "change" },
        ],
        positionId: [
          { required: true, message: "职位信息不允许为空", trigger: "change" },
        ],
      },
    };
  },
  mounted() {   
    this.loadOrgData();
  },
  methods: {
    ...mapActions("organization", ["getOrgTree", "getDeptPositionByOrgId"]),
    ...mapActions("role", ["list"]),
    handleSearchDepartment(searchKey) {
      this.$refs.treeSelect.filterFun(searchKey);
    },
    loadDeptPosition(orgId) {
      this.getDeptPositionByOrgId(orgId).then((data) => {
        this.deptPositions = data;
      });
    },
    loadRoleData() {
      this.list().then((data) => {
        this.roles = data;
      });
    },
    handleClearDepartment() {
      this.deptPositions = [];
      this.userInfo.positionId = null;
    },
    loadOrgData() {
      this.getOrgTree().then((data) => {
        this.orgData = data;
      });
    },
    handlePositionChange(val) {},
  },
};
</script>