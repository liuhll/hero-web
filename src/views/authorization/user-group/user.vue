<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <div class="filter-container">
          <el-input
            v-model="query.searchKey"
            placeholder="请输入用户名、中文名、手机、Email进行搜索..."
            style="width: 350px"
            class="filter-item"
            @keyup.enter.native="handleUserFilter"
          />
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
            icon="el-icon-arrow-left"
            @click="goBack()"
            >返回</el-button
          >
          <el-button
            type="text"
            v-waves
            class="filter-item"
            style="margin-left: 20px; margin-padding: 2px; font-size: 14px"
            >当前用户组: {{ userGroupName }}</el-button
          >
        </div>
        <div class="filter-container">
          <el-button
            v-waves
            @click="handleAddUserGroupUser"
            class="filter-item"
            type="success"
            icon="el-icon-plus"
            >分配组成员</el-button
          >
        </div>
      </el-col>
    </el-row>
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
          <el-table-column prop="positionName" label="职位"></el-table-column>
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
            label="操作"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-popconfirm
                title="您确定要删除该用户组成员吗?"
                placement="top"
                @onConfirm="handleDelete(row)"
                style="margin-left: 10px"
              >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                >
                  删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalCount > 0"
          :total="totalCount"
          :page.sync="query.pageIndex"
          :limit.sync="query.pageCount"
          @pagination="loadUserData"
        />
      </el-col>
    </el-row>

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
import AssignmentUserGroupUserForm from "./components/AssignmentUserGroupUserForm";
import { Loading } from "element-ui";
export default {
  components: {
    Pagination,
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
  },
  data() {
    return {
      query: {
        userGroupId: undefined,
        searchKey: undefined,
        pageCount: 10,
        pageIndex: 1,
      },
      listLoading: false,
      totalCount: 0,
      userData: [],
      userGroupName: "",
      dialogFormVisible: false,
      userGroupId: undefined,
      user: {
        name: undefined,
        memo: undefined,
      },
      dialogAssignmentUserGroupUserVisible: false,
    };
  },
  mounted() {
    if (this.$route.query && this.$route.query.userGroupId) {
      this.query.userGroupId = this.$route.query.userGroupId;
      this.userGroupId = this.$route.query.userGroupId;
      this.userGroupName = this.$route.query.userGroupName;
      this.loadUserData();
    }
  },
  methods: {
    ...mapActions("userGroup", [
      "searchUserGroupUser",
      "deleteUserGroupUser",
      "addUserGroupUsers",
    ]),
    handleUserFilter() {
      this.query.pageIndex = 1;
      this.loadUserData();
    },
    loadUserData() {
      this.listLoading = true;
      this.searchUserGroupUser(this.query).then((data) => {
        this.totalCount = data.totalCount;
        this.userData = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },

    handleDelete(row) {
      const deleteUser = {
        userGroupId: this.userGroupId,
        userId: row.id,
      };
      this.deleteUserGroupUser(deleteUser).then((data) => {
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          duration: 2000,
        });
        this.loadUserData();
      });
    },
    handleAddUserGroupUser() {
      this.dialogAssignmentUserGroupUserVisible = true;
      this.$nextTick(() => {
        this.$refs["userGroupUser"].initInput({
          userGroupId: this.userGroupId,
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
          this.loadUserData();
        });
      }
    },
    handleClear() {
      this.query.pageIndex = 1;
      this.query.searchKey = "";
      this.loadUserData();
    },
    goBack() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ name: "usergroup" });
    },
  },
};
</script>

<style></style>
