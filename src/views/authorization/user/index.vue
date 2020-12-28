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
            v-permission="{ name: 'user-search' }"
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
            v-permission="{ name: 'user-create' }"
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
              el-scroll="scroll"
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
              <el-table-column
                prop="displayUserGroups"
                label="用户组"
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
                prop="creatorUserName"
                label="创建人"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="creationTime"
                label="创建时间"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="lastModificationUserName"
                label="更新人"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="lastModificationTime"
                label="更新时间"
                min-width="100"
              ></el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="280"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{ row }">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="handleUpdate(row)"
                    v-permission="{ name: 'user-update' }"
                    >编辑</el-button
                  >

                  <el-popconfirm
                    title="您确定要删除该用户吗?"
                    placement="top"
                    @onConfirm="handleDelete(row)"
                    style="margin-left: 10px"
                  >
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      slot="reference"
                      v-permission="{ name: 'user-delete' }"
                    >
                      删除</el-button
                    >
                  </el-popconfirm>

                  <el-badge :is-dot="false" size="mini" class="item">
                    <el-dropdown size="mini" style="margin-left: 10px">
                      <el-button type="primary" size="mini" class="filter-item">
                        更多
                        <i class="el-icon-arrow-down el-icon--right" />
                      </el-button>
                      <el-dropdown-menu
                        slot="dropdown"
                        style="width: 95px; padding: 5px 0"
                      >
                        <el-badge :is-dot="false" size="mini" class="item">
                          <el-dropdown-item
                            @click.native="handleResetPwd(row)"
                            v-permission="{ name: 'user-reset-password' }"
                            ><svg-icon
                              icon-class="password"
                            />&nbsp;重置密码</el-dropdown-item
                          >
                        </el-badge>
                        <el-badge :is-dot="false" size="mini" class="item">
                          <el-dropdown-item
                            v-if="row.status == 1"
                            @click.native="handleModifyStatus(row, 'freeze')"
                            v-permission="{ name: 'user-status' }"
                            ><svg-icon
                              icon-class="freeze"
                            />&nbsp;冻结</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-if="row.status == 0"
                            @click.native="handleModifyStatus(row, 'activate')"
                            ><svg-icon
                              icon-class="activate"
                              v-permission="{ name: 'user-status' }"
                            />&nbsp;激活</el-dropdown-item
                          >
                        </el-badge>
                        <el-badge :is-dot="false" size="mini" class="item">
                          <el-dropdown-item
                            @click.native="handleLook(row)"
                            v-permission="{ name: 'user-look' }"
                            ><svg-icon
                              icon-class="look"
                            />&nbsp;查看</el-dropdown-item
                          >
                        </el-badge>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-badge>
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
import scroll from "@/directive/el-scroll/index.js";
import OrgNode from "@/views/organization/components/OrgNode.vue";
import CreateOrUpdate from "./components/UserinfoForm.vue";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { operateType } from "@/utils";
import { Loading } from "element-ui";
import permission from "@/directive/permission/index.js"; // 权限判断指令

export default {
  components: {
    OrgNode,
    CreateOrUpdate,
    Pagination,
  },
  directives: { waves, scroll, permission },
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
    ...mapActions("organization", ["getOwnOrgTree", "getDeptPositionByOrgId"]),
    ...mapActions("user", [
      "queryUser",
      "create",
      "update",
      "updateStatus",
      "deleteUser",
      "resetPassword",
    ]),
    loadOrgData() {
      this.getOwnOrgTree().then((data) => {
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
      this.$router.push({
        name: "user-update",
        query: {
          id: row.id,
        },
      });
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
          }).then((data) => {
            this.$notify({
              title: "成功",
              message: data,
              type: "success",
              duration: 2000,
            });
            this.loadUserData();
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
      this.deleteUser(row.id).then((data) => {
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          duration: 2000,
        });
        this.loadUserData();
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
          }).then((data) => {
            this.$notify({
              title: "成功",
              message: data,
              type: "success",
              duration: 2000,
            });
            this.loadUserData();
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
.el-table {
  .cell {
    padding: 2px 10px;
  }
}
.treeScrollbar::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f1f1f1;
}

.treeScrollbar::-webkit-scrollbar {
  //滚动条的宽度
  width: 10px;
  height: 10px;
}

.treeScrollbar::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: #c1c1c1;
  background-clip: padding-box;
  min-height: 28px;
  border-radius: 8px;
}

.treeScrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
</style>