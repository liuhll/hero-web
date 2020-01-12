<template>
  <div class="app-container">
    <el-form
      ref="departmentForm"
      label-position="left"
      label-width="90px"
      :model="department"
      :disabled="operate === 0"
    >
      <el-form-item label="部门名称" prop="name" required>
        <el-input v-model="department.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门类型" prop="deptTypeId" required>
        <el-select v-model="department.deptTypeId">
          <el-option
            v-for="item in departmentTypes"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="办公区域" prop="location">
        <el-input v-model="department.location" />
      </el-form-item>
      <el-form-item label="部门简介" prop="briefIntro">
        <el-input type="textarea" v-model="department.briefIntro" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="department.memo" />
      </el-form-item>
      <el-form-item label="职位信息" prop="positions">
        <el-button type="success" icon="el-icon-plus" v-if="operate!== 0" @click="createPosition">新增</el-button>
        <div class="department-container">
          <el-table
            :data="department.positions"
            border
            small
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column prop="name" label="职位名称"></el-table-column>
            <el-table-column prop="postResponsibility" label="岗位职责"></el-table-column>
            <el-table-column prop="functionName" label="职能"></el-table-column>
            <el-table-column prop="positionLevelName" label="职位级别"></el-table-column>
            <el-table-column label="是否部门负责人">
              <template slot-scope="{row}">
                <el-tag
                  :type="row.isLeadershipPost | statusTagFilter"
                >{{ row.isLeadershipPost | statusFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否领导人岗位">
              <template slot-scope="{row}">
                <el-tag
                  :type="row.isLeadingOfficial | statusTagFilter"
                >{{ row.isLeadingOfficial | statusFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="briefIntro" label="简介"></el-table-column>
            <el-table-column prop="memo" label="备注"></el-table-column>
            <el-table-column label="操作" min-width="100" v-if="operate !== 0">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini">编辑</el-button>
                <el-button type="danger" size="mini">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
     
    >
      <position-form :position="editPosition"></position-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PositionForm from "./position-form.vue";
const deptTypeCode = "DeptType",
  positionLevelCode = "PositionLevel",
  positionFunctionCode = "PositionFunction";
export default {
  components: {
    PositionForm
  },
  props: {
    department: {
      type: Object,
      default: () => {}
    },
    operate: {
      type: Number,
      default: () => 0
    }
  },
  filters: {
    statusTagFilter(val) {
      const statusTagMap = ["success", "danger"];
      if (val) {
        return statusTagMap[0];
      } else {
        return statusTagMap[1];
      }
    },
    statusFilter(val) {
      const statusMap = ["是", "否"];
      if (val) {
        return statusMap[0];
      } else {
        return statusMap[1];
      }
    }
  },
  components: {},
  mounted() {
    this.loadDepartmentType();
    // this.loadPositionLevels();
    // this.loadPositionFunctions();
  },
  data() {
    return {
      departmentTypes: [],
      loading: false,
      dialogStatus: "",
      dialogFormVisible: false,
      textMap: {
        update: "编辑岗位",
        create: "新增岗位"
      },
      editPosition: {
        name: ""
      }
    };
  },
  methods: {
    ...mapActions("wordbook", ["getWordbookitemByCode"]),
    loadDepartmentType() {
      this.getWordbookitemByCode(deptTypeCode).then(data => {
        this.departmentTypes = data;
      });
    },
    createPosition() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.app-container {
  position: relative;
  .app-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
}
.department-container {
  padding: 20px 0;
}
</style>