<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <div class="filter-container">
          <el-input
            v-model="query.searchKey"
            placeholder="请输入用户组名称"
            style="width: 350px"
            class="filter-item"
            @keyup.enter.native="handleUserGroupFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleUserGroupFilter"
            v-permission="{ name: 'usergroup-search' }"
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
          <el-checkbox class="filter-item" v-model="query.includeSelfCreate" style="margin-left:10px" @change="handleUserGroupFilter">包括由我维护</el-checkbox>
          <span
            type="text"
            class="filter-item"
            style="margin-left: 20px; margin-padding: 2px; font-size: 14px; color:#0000FF"            
            >* 用户组的数据权限是只限于为该用户组分配的权限,数据权限存在冲突,权限范围值最大的有效</span
          >
          <div class="filter-container">
            <el-button
              v-waves
              @click="handleCreate"
              class="filter-item"
              type="success"
              icon="el-icon-plus"
              v-permission="{ name: 'usergroup-create' }"
              >新增</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="userGroupData"
          border
          fit
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="用户组名" min-width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleLook(scope.row)"
                >{{ scope.row.name }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="identification"
            label="标识"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="dataPermissionTypeDesc"
            label="数据权限"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="displayRoles"
            label="角色"
            min-width="140"
          ></el-table-column>
          <el-table-column
            prop="memo"
            label="备注"
            min-width="150"
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
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="creationTime"
            label="创建时间"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="lastModificationUserName"
            label="更新人"
            min-width="100"
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
                v-permission="{ name: 'usergroup-update' }"
                >编辑</el-button
              >
              <el-popconfirm
                title="您确定要删除该用户组吗?"
                placement="top"
                @onConfirm="handleDelete(row)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                  v-permission="{ name: 'usergroup-delete' }"
                  >删除</el-button
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
                    style="width: 105px; padding: 5px 0"
                  >
                    <el-badge :is-dot="false" size="mini" class="item">
                      <el-dropdown-item
                        v-if="row.status == 1"
                        @click.native="handleModifyStatus(row, 'freeze')"
                        v-permission="{ name: 'usergroup-status' }"
                        ><svg-icon
                          icon-class="freeze"
                        />&nbsp;冻结</el-dropdown-item
                      >
                      <el-dropdown-item
                        v-if="row.status == 0"
                        @click.native="handleModifyStatus(row, 'activate')"
                        v-permission="{ name: 'usergroup-status' }"
                        ><svg-icon
                          icon-class="activate"
                        />&nbsp;激活</el-dropdown-item
                      >
                    </el-badge>
                    <el-badge :is-dot="false" size="mini" class="item">
                      <el-dropdown-item
                        @click.native="handleLook(row)"
                        v-permission="{ name: 'usergroup-search-user' }"
                        ><svg-icon
                          icon-class="look"
                        />&nbsp;查看用户组</el-dropdown-item
                      >
                    </el-badge>
                    <el-badge :is-dot="false" size="mini" class="item">
                      <el-dropdown-item
                        @click.native="handleAddUserGroupUser(row)"
                        v-permission="{ name: 'usergroup-allocation-user' }"
                        ><svg-icon
                          icon-class="assignment"
                        />&nbsp;分配组成员</el-dropdown-item
                      >
                    </el-badge>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-badge>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalCount > 0"
          :total="totalCount"
          :page.sync="query.pageIndex"
          :limit.sync="query.pageCount"
          @pagination="loadUserGroupData"
        />
      </el-col>
    </el-row>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <user-group-form
        ref="userGroup"
        :userGroup="userGroup"
        :dialogStatus="dialogStatus"
      ></user-group-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus !== 'look'">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="分配组成员"
      :visible.sync="dialogAssignmentUserGroupUserVisible"
      width="750px"
    >
      <assignment-user-group-user-form
        ref="userGroupUser"
      ></assignment-user-group-user-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignmentUserGroupUserVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="handleAddUserGroupUserData()"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import UserGroupForm from "./components/UserGroupForm";
import AssignmentUserGroupUserForm from "./components/AssignmentUserGroupUserForm";
import { Loading } from "element-ui";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  components: {
    Pagination,
    UserGroupForm,
    AssignmentUserGroupUserForm,
  },
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
  directives: {
    waves,
    permission,
  },
  data() {
    return {
      query: {
        searchKey: undefined,
        includeSelfCreate: true,
        pageCount: 10,
        pageIndex: 1,
      },
      listLoading: false,
      totalCount: 0,
      userGroupData: [],
      dialogStatus: "",
      dialogFormVisible: false,
      dialogAssignmentUserGroupUserVisible: false,
      userGroup: {
        name: undefined,
        memo: undefined,
        roleIds: [],
        permissionIds: [],
        orgIds: [] 
      },
      textMap: {
        update: "编辑用户组",
        create: "新增用户组",
        look: "查看用户组",
      },
      assignmentUserIds: [],
    };
  },
  mounted() {
    this.loadUserGroupData();
  },
  methods: {
    ...mapActions("userGroup", [
      "searchUserGroup",
      "createUserGroup",
      "updateUserGroup",
      "deleteUserGroup",
      "getUserGroup",
      "addUserGroupUsers",
      "updateUserGroupStatus",
    ]),
    handleUserGroupFilter() {
      this.query.pageIndex = 1;
      this.loadUserGroupData();
    },
    loadUserGroupData() {
      this.listLoading = true;
      this.searchUserGroup(this.query).then((data) => {
        this.totalCount = data.totalCount;
        this.userGroupData = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },
    handleCreate() {
      this.resetUserGroupInfo();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userGroup"].$refs["userGroupForm"].clearValidate();
      });
    },
    handleAddUserGroupUser(row) {
      this.dialogAssignmentUserGroupUserVisible = true;
      this.$nextTick(() => {
        this.$refs["userGroupUser"].initInput({
          userGroupId: row.id,
          userIds: [],
        });
      });
    },
    handleAddUserGroupUserData() {
      const groupUsers = this.$refs["userGroupUser"].input;
      if (!groupUsers.userIds || groupUsers.userIds.length <= 0) {
        this.$message.error("请添加要分配给该用户组的用户");
      } else {
        let loadingInstance = Loading.service({
          target: ".el-dialog",
          text: "保存中...",
        });
        this.addUserGroupUsers(groupUsers).then((data) => {
          this.$notify({
            title: "成功",
            message: data,
            type: "success",
            duration: 2000,
          });
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
          this.dialogAssignmentUserGroupUserVisible = false;
        });
      }
    },
    handleUpdate(row) {
      this.resetUserGroupInfo();
      this.userGroup = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["userGroup"].roles = row.roles;
        this.$refs["userGroup"].$refs["userGroupForm"].clearValidate();
      });
    },
    loadUserGroup(id) {
      this.getUserGroup(id).then((data) => {
        this.userGroup = data;
      });
    },
    handleDelete(row) {
      this.deleteUserGroup(row.id).then((data) => {
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          duration: 2000,
        });
        this.loadUserGroupData();
      });
    },
    handleClear() {
      this.query.pageIndex = 1;
      this.query.searchKey = "";
      this.query.includeSelfCreate = false;
      this.loadUserGroupData();
    },
    resetUserGroupInfo() {
      this.userGroup = {
        name: undefined,
        memo: undefined,
        permissionIds: [],
      };
    },
    createData() {
      this.$refs["userGroup"].$refs["userGroupForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.createUserGroup(this.userGroup)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.resetUserGroupInfo();
              this.loadUserGroupData();
              this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
              });
            })
            .catch((err) => {
              this.dialogFormVisible = false;
              this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
              });
            });
        }
      });
    },
    updateData() {
      this.$refs["userGroup"].$refs["userGroupForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.updateUserGroup(this.userGroup)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.resetUserGroupInfo();
              this.loadUserGroupData();
              this.$nextTick(() => {
                loadingInstance.close();
              });
            })
            .catch((err) => {
              this.dialogFormVisible = false;
              this.$nextTick(() => {
                loadingInstance.close();
              });
            });
        }
      });
    },
    handleLook(row) {
      this.$router.push({
        name: "usergroup-user",
        query: {
          userGroupId: row.id,
          userGroupName: row.name,
        },
      });
    },
    handleModifyStatus(row, operate) {
      let operateDesc;
      let status = 0;
      if (operate == "freeze") {
        operateDesc = "冻结";
        status = 0;
      }
      if (operate == "activate") {
        operateDesc = "激活";
        status = 1;
      }
      this.$confirm(`您是否确认${operateDesc}该用户组?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.updateUserGroupStatus({
            id: row.id,
            status: status,
          }).then((data) => {
            this.$notify({
              title: "成功",
              message: data,
              type: "success",
              duration: 2000,
            });
            this.loadUserGroupData();
          });
        })
        .catch((err) => {
          this.$notify({
            title: "提示",
            message: `取消${operateDesc}操作${err};`,
            type: "info",
            duration: 2000,
          });
        });
    },
  },
};
</script>

<style></style>
