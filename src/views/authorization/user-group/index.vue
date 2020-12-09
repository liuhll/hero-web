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
          <el-table-column
            prop="name"
            label="用户组名"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="memo"
            label="备注"
            min-width="150"
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
                            ><svg-icon
                              icon-class="freeze"
                            />&nbsp;冻结</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-if="row.status == 0"
                            @click.native="handleModifyStatus(row, 'activate')"
                            ><svg-icon
                              icon-class="activate"
                            />&nbsp;激活</el-dropdown-item
                          >
                        </el-badge>                      
                        <el-badge :is-dot="false" size="mini" class="item">
                          <el-dropdown-item @click.native="handleAddUserGroupUser(row)"
                            ><svg-icon
                              icon-class="assignment"
                            />&nbsp;增加组成员</el-dropdown-item
                          >
                        </el-badge>
                        <el-badge :is-dot="false" size="mini" class="item">
                          <el-dropdown-item @click.native="handleLook(row)"
                            ><svg-icon
                              icon-class="look"
                            />&nbsp;查看用户组</el-dropdown-item
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
      width="30%"
    >
      <user-group-form   
        ref="userGroup"
        :userGroup="userGroup"
        :dialogStatus="dialogStatus"></user-group-form>
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
      title="增加组成员"
      :visible.sync="dialogAssignmentUserGroupUserVisible"
      width="750px"
       ref="assignmentUserGroupUserDialog"
    >
      <assignment-user-group-user-form 
        ref="assignmentUserGroupUser"
        :userIds="assignmentUserIds"></assignment-user-group-user-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignmentUserGroupUserVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleAddUserGroupUserData()"
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
import AssignmentUserGroupUserForm from "./components/AssignmentUserGroupUserForm"
import { Loading } from "element-ui";
export default {
  components: {
    Pagination,
    UserGroupForm,
    AssignmentUserGroupUserForm
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
  },
  data() {
    return {
      query: {
        searchKey: undefined,
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
      },
      textMap: {
        update: "编辑用户组",
        create: "新增用户组",
        look: "查看用户组",
      },
      assignmentUserIds: []
    };
  },
  mounted() {
    this.loadUserGroupData();
  },
  methods: {
    ...mapActions("userGroup", ["searchUserGroup", "createUserGroup", "updateUserGroup", "deleteUserGroup", "getUserGroup"]),
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
    handleAddUserGroupUser() {
      this.assignmentUserIds = []
      this.dialogAssignmentUserGroupUserVisible = true;
    },
    handleAddUserGroupUserData() {

    },
    handleUpdate(row) {
      this.resetUserGroupInfo();
      this.userGroup = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs["userGroup"].$refs["userGroupForm"].clearValidate();
      });
    },
    loadUserGroup(id) {
      this.getUserGroup(id).then((data) => {
        this.userGroup = data;
      })
    },
    handleDelete(row) {
      this.deleteUserGroup(row.id)
        .then((data) => {
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
      this.resetUserGroupInfo();
      this.userGroup = Object.assign({}, row); // copy obj
      this.dialogStatus = "look";
      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs["userGroup"].$refs["userGroupForm"].clearValidate();
      });
    },
  },
};
</script>

<style></style>
