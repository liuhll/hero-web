<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <div class="filter-container">
          <el-input
            v-model="query.searchKey"
            placeholder="请输入角色名称"
            style="width: 350px"
            class="filter-item"
            @keyup.enter.native="handleRoleFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleRoleFilter"
            v-permission="{ name: 'role-search' }"
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
              v-permission="{ name: 'role-create' }"
              >新增</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="roleData"
          border
          fit
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column
            prop="name"
            label="角色名"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="identification"
            label="标识"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="displayOrganizations"
            label="所属部门"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="dataPermissionTypeDes"
            label="数据权限"
            min-width="100"
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
                v-permission="{ name: 'role-update' }"
                >编辑</el-button
              >
              <el-popconfirm
                title="您确定要删除该角色吗?"
                placement="top"
                @onConfirm="handleDelete(row)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                  v-permission="{ name: 'role-delete' }"
                  >删除</el-button
                >
              </el-popconfirm>

              <!-- <el-button type="success" size="mini" @click="handleLook(row)">
                <svg-icon icon-class="look" />
                查看</el-button
              > -->
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
                        v-if="row.status == 1"
                        @click.native="handleModifyStatus(row, 'freeze')"
                        v-permission="{ name: 'role-status' }"
                        ><svg-icon
                          icon-class="freeze"
                        />&nbsp;冻结</el-dropdown-item
                      >
                      <el-dropdown-item
                        v-if="row.status == 0"
                        @click.native="handleModifyStatus(row, 'activate')"
                        v-permission="{ name: 'role-status' }"
                        ><svg-icon
                          icon-class="activate"
                        />&nbsp;激活</el-dropdown-item
                      >
                    </el-badge>
                    <el-badge :is-dot="false" size="mini" class="item">
                      <el-dropdown-item
                        @click.native="handleLook(row)"
                        v-permission="{ name: 'role-look' }"
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
          v-show="totalCount > 0"
          :total="totalCount"
          :page.sync="query.pageIndex"
          :limit.sync="query.pageCount"
          @pagination="loadRoleData"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import RoleForm from "./components/RoleForm.vue";
import { Loading } from "element-ui";
import permission from "@/directive/permission/index.js";
export default {
  components: {
    Pagination,
    RoleForm,
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
        pageCount: 10,
        pageIndex: 1,
      },
      listLoading: false,
      totalCount: 0,
      roleData: [],
      dialogStatus: "",
      dialogFormVisible: false,
      role: {
        name: undefined,
        memo: undefined,
        orgIds: [],
        permissionIds: [],
      },
      textMap: {
        update: "编辑角色",
        create: "新增角色",
        look: "查看角色",
      },
    };
  },
  mounted() {
    this.loadRoleData();
  },
  methods: {
    ...mapActions("role", [
      "search",
      "create",
      "update",
      "delete",
      "updateStatus",
    ]),
    handleRoleFilter() {
      this.query.pageIndex = 1;
      this.loadRoleData();
    },
    loadRoleData() {
      this.listLoading = true;
      this.search(this.query).then((data) => {
        this.totalCount = data.totalCount;
        this.roleData = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },
    handleCreate() {
      this.$router.push({
        name: "role-create",
      });
    },
    handleUpdate(row) {
      this.$router.push({
        name: "role-update",
        query: {
          id: row.id,
        },
      });
    },
    handleDelete(row) {
      this.delete(row.id).then((data) => {
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          duration: 2000,
        });
        this.loadRoleData();
      });
    },
    handleClear() {
      this.query.pageIndex = 1;
      this.query.searchKey = "";
      this.loadRoleData();
    },
    resetRoleInfo() {
      this.role = {
        name: undefined,
        memo: undefined,
        permissionIds: [],
      };
    },
    handleLook(row) {
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
      this.$confirm(`您是否确认${operateDesc}该角色?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.updateStatus({
            id: row.id,
            status: status,
          }).then((data) => {
            this.$notify({
              title: "成功",
              message: data,
              type: "success",
              duration: 2000,
            });
            this.loadRoleData();
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
