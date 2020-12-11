<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <div class="filter-container">
          <el-input
            v-model="query.searchKey"
            placeholder="请输入字典名称"
            style="width: 350px"
            class="filter-item"
            @keyup.enter.native="handleWordbookFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleWordbookFilter"
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
          :data="wordbookData"
          border
          fit
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="字典名" min-width="100">
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
            prop="memo"
            label="备注"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="code"
            label="标识"
            min-width="140"
          ></el-table-column>
          <el-table-column prop="typeDesc" label="类型" min-width="150">
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
            width="250"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="handleUpdate(row)"
                v-if="row.type !==1"
                >编辑</el-button
              >
              <el-popconfirm
                title="您确定要删除该字典吗?"
                placement="top"
                v-if="row.type !==1"
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
                      <el-dropdown-item @click.native="handleLook(row)"
                        ><svg-icon
                          icon-class="look"
                        />&nbsp;查看字典</el-dropdown-item
                      >
                    </el-badge>
                    <el-badge :is-dot="false" size="mini" class="item">
                      <el-dropdown-item
                        @click.native="handleAddWordbookItem(row)"
                        ><svg-icon
                          icon-class="assignment"
                        />&nbsp;新增字典項</el-dropdown-item
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
          @pagination="loadWordbookData"
        />
      </el-col>
    </el-row>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <wordbook-form
        ref="wordbook"
        :wordbook="wordbook"
        :dialogStatus="dialogStatus"
      ></wordbook-form>
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
      title="新增字典項"
      :visible.sync="dialogAssignmentWordbookItemVisible"
      width="750px"
    >
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignmentWordbookItemVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="handleAddWordbookItemData()"
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
import WordbookForm from "./components/WordbookForm";
import AssignmentWordbookItemForm from "./components/AssignmentWordbookItemForm";
import { Loading } from "element-ui";
export default {
  components: {
    Pagination,
    WordbookForm,
    AssignmentWordbookItemForm,
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
      wordbookData: [],
      dialogStatus: "",
      dialogFormVisible: false,
      dialogAssignmentWordbookItemVisible: false,
      wordbook: {
        name: undefined,
        memo: undefined,
        roleIds: [],
      },
      textMap: {
        update: "编辑字典",
        create: "新增字典",
        look: "查看字典",
      },
      assignmentUserIds: [],
    };
  },
  mounted() {
    this.loadWordbookData();
  },
  methods: {
    ...mapActions("wordbook", [
      "searchWordbook",
      "createWordbook",
      "updateWordbook",
      "deleteWordbook",
      "getWordbook",
      "addWordbookItems",
      "updateWordbookStatus",
    ]),
    handleWordbookFilter() {
      this.query.pageIndex = 1;
      this.loadWordbookData();
    },
    loadWordbookData() {
      this.listLoading = true;
      this.searchWordbook(this.query).then((data) => {
        this.totalCount = data.totalCount;
        this.wordbookData = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },
    handleCreate() {
      this.resetWordbookInfo();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["wordbook"].$refs["wordbookForm"].clearValidate();
      });
    },
    handleAddWordbookItem(row) {
      this.dialogAssignmentWordbookItemVisible = true;
      this.$nextTick(() => {
        this.$refs["wordbookUser"].initInput({
          wordbookId: row.id,
          userIds: [],
        });
      });
    },
    handleAddWordbookItemData() {
      const groupUsers = this.$refs["wordbookUser"].input;
      if (!groupUsers.userIds || groupUsers.userIds.length <= 0) {
        this.$message.error("请添加要分配给该字典的用户");
      } else {
        let loadingInstance = Loading.service({
          target: ".el-dialog",
          text: "保存中...",
        });
        this.addWordbookItems(groupUsers).then((data) => {
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
          this.dialogAssignmentWordbookItemVisible = false;
        });
      }
    },
    handleUpdate(row) {
      this.resetWordbookInfo();
      this.wordbook = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["wordbook"].roles = row.roles;
        this.$refs["wordbook"].$refs["wordbookForm"].clearValidate();
      });
    },
    loadWordbook(id) {
      this.getWordbook(id).then((data) => {
        this.wordbook = data;
      });
    },
    handleDelete(row) {
      this.deleteWordbook(row.id).then((data) => {
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          duration: 2000,
        });
        this.loadWordbookData();
      });
    },
    handleClear() {
      this.query.pageIndex = 1;
      this.query.searchKey = "";
      this.loadWordbookData();
    },
    resetWordbookInfo() {
      this.wordbook = {
        name: undefined,
        memo: undefined,
        permissionIds: [],
      };
    },
    createData() {
      this.$refs["wordbook"].$refs["wordbookForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.createWordbook(this.wordbook)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.resetWordbookInfo();
              this.loadWordbookData();
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
      this.$refs["wordbook"].$refs["wordbookForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.updateWordbook(this.wordbook)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.resetWordbookInfo();
              this.loadWordbookData();
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
        name: "wordbook-item",
        query: {
          wordbookId: row.id,
          wordbookName: row.name,
        },
      });
    },
  },
};
</script>

<style></style>
