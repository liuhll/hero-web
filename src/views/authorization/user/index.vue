<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input
          placeholder="请输入组织结构名称进行过滤"
          v-model="filterOrgName"
        ></el-input>
        <el-scrollbar style="height: 600px; width: 100%">
          <el-tree
            :data="orgData"
            default-expand-all
            :render-content="renderContent"
            :expand-on-click-node="false"
            @node-click="handleOrgNodeClick"
            :filter-node-method="filterOrgNode"
            ref="orgTree"
          ></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <div class="filter-container">
          <el-input
            v-model="query.searchKey"
            placeholder="请输入用户名、中文名、手机、Email进行搜索..."
            style="width: 350px"
            class="filter-item"
            @keyup.enter.native="handleUserFilter"
          />
          <el-select
            placeholder="请选择用户状态"
            v-model="query.status"
            class="filter-item"
            @change="handleChangeQueryUserStatus"
          >
            <el-option key="1" label="有效" value="1"></el-option>
            <el-option key="0" label="冻结" value="0"></el-option>
          </el-select>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleUserFilter"
            >搜索</el-button
          >
          <el-button
            v-waves
            class="filter-item"
            type="default"
            icon="el-icon-clear"
            @click="handleClear"
            >清除</el-button
          >
        </div>
        <div class="filter-container">
          <el-button
            v-waves
            @click="handleCreate"
            class="filter-item"
            type="success"
            icon="el-icon-plus"
            >新增</el-button
          >
        </div>
        <el-row>
          <el-col>
            <el-table
              :data="userData"
              border
              fit
              highlight-current-row
              v-loading="listLoading"
              style="width: 100%"
            >
              <el-table-column
                prop="userName"
                label="用户名"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="chineseName"
                label="中文名"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="email"
                label="电子邮件"
                min-width="110"
              ></el-table-column>
              <el-table-column prop="phone" label="手机"></el-table-column>
              <el-table-column prop="deptName" label="部门"></el-table-column>
              <el-table-column
                prop="positionName"
                label="职位"
              ></el-table-column>
              <el-table-column
                prop="displayRoles"
                label="角色"
                min-width="140"
              ></el-table-column>
              <el-table-column label="状态" class-name="status-col">
                <template slot-scope="{ row }">
                  <el-tag :type="row.status | statusTagFilter">
                    {{ row.status | statusFilter }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="380"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{ row }">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleUpdate(row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="default"
                    size="mini"
                    @click="handleResetPwd(row)"
                    >密码</el-button
                  >
                  <el-button
                    v-if="row.status == 1"
                    size="mini"
                    type="warning"
                    @click="handleModifyStatus(row, 'freeze')"
                    >冻结</el-button
                  >
                  <el-button
                    v-if="row.status == 0"
                    size="mini"
                    type="success"
                    @click="handleModifyStatus(row, 'activate')"
                    >激活</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(row)"
                    >删除</el-button
                  >
                  <el-button size="mini" type="info" @click="handleLook(row)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="userDataTotal > 0"
              :total="userDataTotal"
              :page.sync="query.pageIndex"
              :limit.sync="query.pageCount"
              @pagination="loadUserData"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import OrgNode from "@/views/organization/components/OrgNode.vue";
import CreateOrUpdate from "./components/UserinfoForm.vue";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { operateType } from "@/utils";
import { Loading } from "element-ui";

export default {
  components: {
    OrgNode,
    CreateOrUpdate,
    Pagination,
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = ["冻结", "有效"];
      return statusMap[status];
    },
    statusTagFilter(status) {
      const statusMap = ["danger", "success"];
      return statusMap[status];
    },
  },
  data() {
    return {
      orgData: [],
      userData: [],
      listLoading: true,
      userDataTotal: 0,
      dialogStatus: "",
      filterOrgName: "",
      dialogFormVisible: false,
      textMap: {
        update: "编辑用户",
        create: "新增用户",
      },
      query: {
        searchKey: "",
        orgId: 0,
        pageCount: 10,
        pageIndex: 1,
      },
    };
  },
  mounted() {
    this.loadOrgData();
    this.loadUserData();
  },
  watch: {
    filterOrgName(val) {
      this.$refs.orgTree.filter(val);
    },
  },
  methods: {
    ...mapActions("organization", ["getOrgTree", "getDeptPositionByOrgId"]),
    ...mapActions("user", [
      "queryUser",
      "create",
      "update",
      "updateStatus",
      "deleteUser",
      "resetPassword",
    ]),
    loadOrgData() {
      this.getOrgTree().then((data) => {
        this.orgData = data;
      });
    },
    handleUserFilter() {
      this.query.pageIndex = 1;
      this.loadUserData();
    },
    handleClear() {
      this.query.pageIndex = 1;
      this.query.searchKey = "";
      this.query.orgId = 0;
      delete this.query.status;
      this.loadUserData();
    },
    handleOrgNodeClick(data, node) {
      this.query.pageIndex = 1;
      this.query.orgId = data.id;
      this.loadUserData();
    },
    handleChangeQueryUserStatus(value) {
      this.query.pageIndex = 1;
      this.query.status = value;
      this.loadUserData();
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;

    },
    handleResetPwd(row) {
      this.$prompt(`重置该账号密码`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
        inputErrorMessage: "密码格式不正确(保护数字和字符,不低于6位)",
      })
        .then(({ value }) => {
          this.resetPassword({
            id: row.id,
            newPassword: value,
          })
            .then((data) => {
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.loadUserData();
            })
            .catch((err) => {
              this.$notify({
                title: "失败",
                message: err.message,
                type: "error",
                duration: 2000,
              });
            });
        })
        .catch((err) => {
          this.$notify({
            title: "提示",
            message: "取消密码重置",
            type: "info",
            duration: 2000,
          });
        });
    },
    handleDelete(row) {
      this.$confirm(`您是否确认删除该账户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUser(row.id)
            .then((data) => {
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.loadUserData();
            })
            .catch((err) => {
              this.$notify({
                title: "失败",
                message: err.message,
                type: "error",
                duration: 2000,
              });
            });
        })
        .catch((err) => {
          this.$notify({
            title: "提示",
            message: "取消删除操作",
            type: "info",
            duration: 2000,
          });
        });
    },
    loadUserData() {
      this.listLoading = true;
      this.queryUser(this.query).then((data) => {
        this.userDataTotal = data.totalCount;
        this.userData = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },
    updateData() {
      this.$refs["userInfo"].$refs["userInfoForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.update(this.userInfo)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.loadUserData();
              this.$nextTick(() => {
                loadingInstance.close();
              });
            })
            .catch((err) => {
              this.dialogFormVisible = false;
              this.$nextTick(() => {
                loadingInstance.close();
              });
              this.$notify({
                title: "失败",
                message: err.message,
                type: "error",
                duration: 2000,
              });
            });
        }
      });
    },
    handleModifyStatus(row, operate) {
      let operateDesc;
      let userStatus = 0;
      if (operate == "freeze") {
        operateDesc = "冻结";
        userStatus = 0;
      }
      if (operate == "activate") {
        operateDesc = "激活";
        userStatus = 1;
      }
      this.$confirm(`您是否确认${operateDesc}该账户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.updateStatus({
            id: row.id,
            status: userStatus,
          })
            .then((data) => {
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.loadUserData();
            })
            .catch((err) => {
              this.$notify({
                title: "失败",
                message: err.message,
                type: "error",
                duration: 2000,
              });
            });
        })
        .catch((err) => {
          this.$notify({
            title: "提示",
            message: `取消${operateDesc}操作`,
            type: "info",
            duration: 2000,
          });
        });
    },
    handleCreate() {
      this.$router.push({
        name: "user-create",
        query: {
          type: "create",
        },
      });
    },
    handleDialogClose() {
      this.$refs["userInfo"].isResetPosition = false;
    },
    filterOrgNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    renderContent(h, { node, data, store }) {
      return h(OrgNode, {
        props: {
          node: node,
          data: data,
        },
      });
    },
  },
};
</script>
<style lang="scss">
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}
.el-scrollbar {
  height: 100%;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>