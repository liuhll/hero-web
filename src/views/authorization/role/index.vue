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
                title="您确定要删除该角色吗?"
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

              <el-button type="success" size="mini" @click="handleLook(row)">
                <svg-icon icon-class="look" />
                查看</el-button
              >
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="30%"
      @close="handleRoleDialogClose()"
    >
      <role-form
        ref="role"
        :role="role"
        :dialogStatus="dialogStatus"
      ></role-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus !== 'look'">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
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
import RoleForm from "./components/RoleForm.vue";
import { Loading } from "element-ui";
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
    ...mapActions("role", ["search", "create", "update", "delete"]),
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
      this.resetRoleInfo();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["role"].$refs["roleForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.resetRoleInfo();
      this.role = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs["role"].$refs["roleForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.delete(row.id)
        .then((data) => {
          this.$notify({
            title: "成功",
            message: data,
            type: "success",
            duration: 2000,
          });
          this.loadRoleData();
        })
        .catch((err) => {
          this.loadRoleData();
          this.$notify({
            title: "失败",
            message: err.message,
            type: "error",
            duration: 2000,
          });
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
    createData() {
      this.$refs["role"].$refs["roleForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.create(this.role)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.resetRoleInfo();
              this.loadRoleData();
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
    updateData() {
      this.$refs["role"].$refs["roleForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.update(this.role)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.resetRoleInfo();
              this.loadRoleData();
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
    handleRoleDialogClose() {
      this.$refs["role"].$refs["permissionTree"].setCheckedKeys([]);
    },
    handleLook(row) {
      this.resetRoleInfo();
      this.role = Object.assign({}, row); // copy obj
      this.dialogStatus = "look";
      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs["role"].$refs["roleForm"].clearValidate();
      });
    },
  },
};
</script>

<style></style>
