<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-tree
          :data="orgData"
          default-expand-all
          :render-content="renderContent"
          :expand-on-click-node="false"
          @node-click="handleOrgNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-input
            v-model="query.searchKey"
            placeholder="请输入用户名、中文名、手机、Email进行搜索..."
            style="width: 350px;"
            class="filter-item"
            @keyup.enter.native="handleUserFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleUserFilter"
          >搜索</el-button>
          <el-button
            v-waves
            class="filter-item"
            type="default"
            icon="el-icon-clear"
            @click="handleClear"
          >清除</el-button>
        </div>
        <div class="filter-container">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus">新增</el-button>
        </div>
        <div class="filter-container">
          <el-table
            :data="userData"
            border
            fit
            highlight-current-row
            v-loading="listLoading"
            style="width: 100%"
          >
            <el-table-column prop="userName" label="用户名" min-width="80"></el-table-column>
            <el-table-column prop="chineseName" label="中文名" min-width="80"></el-table-column>
            <el-table-column prop="email" label="电子邮件" min-width="110"></el-table-column>
            <el-table-column prop="phone" label="手机"></el-table-column>
            <el-table-column prop="deptName" label="部门"></el-table-column>
            <el-table-column prop="positionName" label="职位"></el-table-column>
            <el-table-column prop="displayRoles" label="角色" min-width="140"></el-table-column>
            <el-table-column label="状态" class-name="status-col">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusTagFilter">{{ row.status | statusFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作"></el-table-column>
          </el-table>
          <pagination
            v-show="userDataTotal>0"
            :total="userDataTotal"
            :page.sync="query.pageIndex"
            :limit.sync="query.pageCount"
            @pagination="loadUserData"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import OrgNode from "@/views/organization/components/org-node.vue";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  components: {
    OrgNode,
    Pagination
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
    }
  },
  data() {
    return {
      orgData: [],
      userData: [],
      listLoading: true,
      userDataTotal: 0,
      query: {
        searchKey: "",
        orgId: 0,
        pageCount: 10,
        pageIndex: 1
      }
    };
  },
  mounted() {
    this.loadOrgData();
    this.loadUserData();
  },
  methods: {
    ...mapActions("organization", ["getOrgTree"]),
    ...mapActions("user", ["queryUser"]),
    loadOrgData() {
      this.getOrgTree().then(data => {
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
      this.loadUserData();
    },
    handleOrgNodeClick(data, node) {
      this.query.pageIndex = 1;
      this.query.orgId = data.id;
      this.loadUserData();
    },
    loadUserData() {
      this.listLoading = true;
      this.queryUser(this.query).then(data => {
        this.userDataTotal = data.totalCount;
        this.userData = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 200);
      });
    },
    renderContent(h, { node, data, store }) {
      return h(OrgNode, {
        props: {
          node: node,
          data: data
        }
      });
    }
  }
};
</script>
