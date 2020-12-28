<template>
  <div>
    <el-card>
      <el-form
        ref="userInfo"
        label-width="110px"
        :model="userInfo"
        :rules="rules"
        class="userinfo"
      >
        <el-row :gutter="30">
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="用户基本信息">
              <el-col :span="12">
                <el-form-item label="用户名" prop="userName">
                  <el-input
                    v-model="userInfo.userName"
                    placeholder="请输入用户名"
                    :disabled="editType === 'update'"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="中文名" prop="chineseName">
                  <el-input
                    v-model="userInfo.chineseName"
                    placeholder="请输入中文名"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="editType === 'create'"
                  label="密码"
                  prop="password"
                >
                  <el-input
                    v-model="userInfo.password"
                    placeholder="请输入密码"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机" prop="phone">
                  <el-input
                    v-model="userInfo.phone"
                    placeholder="请输入手机号码"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮件" prop="email">
                  <el-input
                    v-model="userInfo.email"
                    placeholder="请输入电子邮件"
                    size="small"
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
                      checkStrictly: true,
                      children: 'children',
                    }"
                    clearable
                    placeholder="请选择所属部门"
                    filterable
                    size="small"
                    style="width: 100%"
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
                    style="width: 100%"
                    size="small"
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

              <el-col :span="12">
                <el-form-item label="生日" prop="birth">
                  <el-date-picker
                    v-model="userInfo.birth"
                    type="date"
                    placeholder="请选择生日"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="性别"
                  prop="gender"
                  placeholder="请选择性别"
                  required
                >
                  <el-radio-group
                    v-model="userInfo.gender"
                    style="width: 100%"
                    size="small"
                  >
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="毕业院校" prop="graduateInstitutions">
                  <el-input
                    v-model="userInfo.graduateInstitutions"
                    placeholder="请输入毕业院校"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最高学历" prop="education">
                  <el-select
                    v-model="userInfo.education"
                    style="width: 100%"
                    clearable
                    size="small"
                  >
                    <el-option key="1" label="博士" value="1"></el-option>
                    <el-option key="2" label="硕士" value="2"></el-option>
                    <el-option key="3" label="本科" value="3"></el-option>
                    <el-option key="4" label="专科" value="4"></el-option>
                    <el-option key="5" label="高中" value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专业" prop="major">
                  <el-input
                    v-model="userInfo.major"
                    placeholder="请输入专业"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="籍贯" prop="nativePlace">
                  <el-input
                    v-model="userInfo.nativePlace"
                    placeholder="请输入籍贯"
                    size="small"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="地址" prop="address">
                  <el-input
                    v-model="userInfo.address"
                    placeholder="请输入联系地址"
                    size="small"
                  />
                </el-form-item>
              </el-col>
            </el-tab-pane>
          </el-tabs>
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="角色信息">
              <el-form-item prop="roleIds" label="角色">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="请输入关键字查找要添加的角色"
                  placement="top-start"
                >
                  <el-select
                    v-model="userInfo.roleIds"
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
            </el-tab-pane>
          </el-tabs>
          <el-tabs>
            <el-tab-pane label="用户组信息">
              <el-form-item prop="userGroupIds" label="用户组">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="请输入关键字查找要添加的用户组"
                  placement="top-start"
                >
                  <el-select
                    v-model="userInfo.userGroupIds"
                    multiple
                    clearable
                    filterable
                    remote
                    :loading="loading"
                    :remote-method="searchUserGroups"
                    placeholder="请输入要添加的用户组"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in userGroups"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-tabs style="margin-bottom: 20px">
            <el-tab-pane label="用户简介信息">
              <el-form-item prop="avatar" label="简介">
                <Tinymce ref="editor" v-model="userInfo.resume" :height="80" />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { isEmpty } from "@/utils";
import { isPassword, validatePhone, validatePhoneTwo } from "@/utils/validator";
import { mapActions } from "vuex";
import Tinymce from "@/components/Tinymce";
export default {
  name: "UserinfoPageForm",
  components: {
    Tinymce,
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
    editType: {
      type: String,
      default: "create",
    },
  },
  watch: {
    "userInfo.orgId": {
      handler(newOrgId, oldOrgId) {
        if (oldOrgId && oldOrgId !== newOrgId) {
          debugger;
          this.userInfo.positionId = null;
          this.userInfo.roleIds = [];
        } else if (newOrgId != null && oldOrgId !== newOrgId) {
          this.checkUser(newOrgId);
          if (oldOrgId) {
            this.userInfo.roleIds = [];
            this.queryRole.orgIds = [newOrgId];
            this.loadRoleData();
          }
        } else {
          this.deptPositions = [];
        }
      },
      immediate: false,
    },
  },
  data() {
    return {
      orgData: [],
      deptPositions: [],
      roles: [],
      userGroups: [],
      loading: false,
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
        password: [
          { required: true, message: "密码不允许为空", trigger: "blur" },
          {
            validator: isPassword,
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
            validator: validatePhone,
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
        // roleIds: [
        //   { required: true, message: "角色信息不允许为空", trigger: "change" },
        // ],
        gender: [
          { required: true, message: "请选择用户性别", trigger: "change" },
        ],
      },
      queryRole: {
        searchKey: undefined,
        status: 1,
        pageCount: 50,
        pageIndex: 1,
      },
      queryUserGroup: {
        searchKey: undefined,
        status: 1,
        pageCount: 10,
        pageIndex: 1,
      },
    };
  },
  mounted() {
    this.loadOrgData();
    //this.loadRoleData();
  },
  methods: {
    ...mapActions("organization", ["getOwnOrgTree", "getDeptPositionByOrgId"]),
    ...mapActions("role", ["list", "search"]),
    ...mapActions("userGroup", ["searchUserGroup"]),
    ...mapActions("user", ["check"]),
    handleSearchDepartment(searchKey) {
      this.$refs.treeSelect.filterFun(searchKey);
    },
    loadDeptPosition(orgId) {
      this.getDeptPositionByOrgId(orgId).then((data) => {
        this.deptPositions = data;
      });
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
    loadUserGroupData() {
      this.loading = true;
      this.searchUserGroup(this.queryUserGroup).then((data) => {
        this.totalCount = data.totalCount;
        this.userGroups = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false;
        }, 1.5 * 200);
      });
    },
    handleClearDepartment() {
      this.deptPositions = [];
      this.userInfo.positionId = null;
    },
    loadOrgData() {
      this.getOwnOrgTree().then((data) => {
        this.orgData = data;
      });
    },
    handlePositionChange(val) {},
    searchRoles(key) {
      if (key !== "") {
        this.queryRole.searchKey = key;
      }
      if (!this.userInfo.orgId) {
        this.$message.error("请先选择用户所在的部门");
        return;
      }
      this.queryRole.OrgIds = [this.userInfo.orgId];
      this.loadRoleData();
    },
    searchUserGroups(key) {
      if (key !== "" || !this.userInfo.userGroupIds) {
        this.queryUserGroup.searchKey = key;
        this.loadUserGroupData();
      }
    },
    checkUser(orgId) {
      this.check(orgId).then((data) => {
        if (data) {
          this.loadDeptPosition(orgId);
        } else {
          this.deptPositions = [];
          this.$message.error("您没有添加该部门用户的权限");
        }
      });
    },
  },
};
</script>