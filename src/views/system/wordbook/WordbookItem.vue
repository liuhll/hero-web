<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <div class="filter-container">
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
            >当前字典标识: {{ wordbookCode }}</el-button
          >
          <el-button
            type="text"
            v-waves
            class="filter-item"
            style="margin-left: 20px; margin-padding: 2px; font-size: 14px"
            >当前字典项: {{ wordbookName }}
          </el-button>
        </div>
        <div class="filter-container">
          <el-button
            v-waves
            @click="handleAddWordbookItem"
            class="filter-item"
            type="success"
            icon="el-icon-plus"
            >新增字典项</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :data="wordbookItems"
          border
          fit
          highlight-current-row
          v-loading="listLoading"
          style="width: 100%"
          el-scroll="scroll"
        >
          <el-table-column
            prop="key"
            label="字典项标识"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="value"
            label="字典项值"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            min-width="110"
          ></el-table-column>
          <el-table-column prop="memo" label="备注"></el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="200"
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
                title="您确定要删除该字典项成员吗?"
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
          @pagination="loadWordbookItemData"
        />
      </el-col>
    </el-row>
    <el-dialog
      :title="wordbookItemTextMap[dialogStatus]"
      :visible.sync="wordbookItemVisible"
      width="750px"
    >
      <wordbook-item-form ref="wordbookItem"></wordbook-item-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="wordbookItemVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            dialogStatus == 'create'
              ? handleAddWordbookItemData()
              : handleUpdateWordbookItemData()
          "
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
import { Loading } from "element-ui";
import WordbookItemForm from "./components/WordbookItemForm";
export default {
  components: {
    Pagination,
    WordbookItemForm,
  },
  directives: {
    waves,
  },
  data() {
    return {
      query: {
        wordbookId: undefined,
        pageCount: 10,
        pageIndex: 1,
      },
      listLoading: false,
      totalCount: 0,
      wordbookItems: [],
      wordbookName: "",
      wordbookCode: "",
      wordbookId: undefined,
      currentWordbookKey: undefined,
      wordbookItemTextMap: {
        update: "编辑字典项",
        create: "新增字典项",
        look: "查看字典项",
      },
      dialogStatus: "",
      wordbookItemVisible: false,
    };
  },
  mounted() {
    if (this.$route.query && this.$route.query.wordbookId) {
      this.query.wordbookId = this.$route.query.wordbookId;
      this.wordbookId = this.$route.query.wordbookId;
      this.wordbookName = this.$route.query.wordbookName;
      this.wordbookCode = this.$route.query.wordbookCode;
      this.loadWordbookItemData();
    }
  },
  methods: {
    ...mapActions("wordbook", [
      "getWordbookItems",
      "deleteWordbookItem",
      "updateWordbookItem",
      "createWordbookItem",
    ]),
    handleWordbookItemFilter() {
      this.query.pageIndex = 1;
      this.loadWordbookItemData();
    },
    loadWordbookItemData() {
      this.listLoading = true;
      this.getWordbookItems(this.query).then((data) => {
        this.totalCount = data.totalCount;
        this.wordbookItems = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },
    handleUpdate(row) {
      const wordbookItem = Object.assign({}, row);
      this.currentWordbookKey = row.key;
      this.dialogStatus = "update";
      this.wordbookItemVisible = true;
      this.$nextTick(() => {
        this.$refs["wordbookItem"].initInput(wordbookItem);
        this.$refs["wordbookItem"].$refs["wordbookItemForm"].clearValidate();
      });
    },
    handleDelete(row) {
      this.deleteWordbookItem(row.id).then((data) => {
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          duration: 2000,
        });
        this.loadWordbookItemData();
      });
    },
    handleAddWordbookItem() {
      this.wordbookItemVisible = true;
      this.$nextTick(() => {
        this.$refs["wordbookItem"].initInput({
          wordbookId: this.wordbookId,
        });
      });
    },
    handleAddWordbookItemData() {
      const workBookItem = this.$refs["wordbookItem"].wordbookItem;

      this.$refs["wordbookItem"].$refs["wordbookItemForm"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.createWordbookItem(workBookItem).then((data) => {
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
            this.wordbookItemVisible = false;
            this.loadWordbookItemData();
          });
        }
      });
    },
    handleUpdateWordbookItemData() {
      const workBookItem = this.$refs["wordbookItem"].wordbookItem;
      this.$refs["wordbookItem"].$refs["wordbookItemForm"].validate((valid) => {
        if (valid) {
          if (workBookItem.key !== this.currentWordbookKey) {
            this.$confirm(
              `修改字典项的key可能会导致数据异常,是否继续？`,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            ).then(() => {
              this.updateWordbookItemData(workBookItem);
            });
          } else {
            this.updateWordbookItemData(workBookItem);
          }
        }
      });
    },
    updateWordbookItemData(workBookItem) {
      let loadingInstance = Loading.service({
        target: ".el-dialog",
        text: "保存中...",
      });
      this.updateWordbookItem(workBookItem).then((data) => {
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
        this.wordbookItemVisible = false;
        this.loadWordbookItemData();
      });
    },
    goBack() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ name: "wordbook" });
    },
  },
};
</script>

<style></style>
