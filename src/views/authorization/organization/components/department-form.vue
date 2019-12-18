<template>
  <el-form
    label-position="left"
    label-width="90px"
    :model="department"
    :disabled="selectedOrg.operate === 0"
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
    <el-form-item label="位置" prop="location">
      <el-input v-model="department.location" />
    </el-form-item>
    <el-form-item label="简介" prop="briefIntro">
      <el-input type="textarea" v-model="department.briefIntro" />
    </el-form-item>
    <el-form-item label="备注" prop="memo">
      <el-input type="textarea" v-model="department.memo" />
    </el-form-item>
    <el-form-item label="职位信息" prop="positions">
      <el-row v-if="selectedOrg.operate !== 0">
        <el-col :span="24">
          <el-button type="success" icon="el-icon-plus">新增</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="department.positions"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column prop="name" label="职位名称" min-width="80"></el-table-column>
            <el-table-column prop="postResponsibility" label="岗位职责" min-width="80"></el-table-column>
            <el-table-column prop="functionName" label="职能" min-width="80"></el-table-column>
            <el-table-column prop="positionLevelName" label="职位级别" min-width="80"></el-table-column>
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
            <el-table-column prop="briefIntro" label="简介" min-width="80"></el-table-column>
            <el-table-column prop="memo" label="备注" min-width="80"></el-table-column>
            <el-table-column label="操作" min-width="120" v-if="selectedOrg.operate !== 0">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini">编辑</el-button>
                <el-button type="danger" size="mini">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form-item>
    <div v-if="selectedOrg.operate !== 0">
      <el-row>
        <el-col :offset="6" :span="18">
          <el-button type="success" icon="el-icon-plus">保存</el-button>
          <el-button type="danger" icon="el-icon-cancel">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import { mapActions } from "vuex";
const deptTypeCode = "DeptType",
  positionLevelCode = "PositionLevel",
  positionFunctionCode = "PositionFunction";
export default {
  props: {
    department: {
      type: Object,
      default: () => {}
    },
    selectedOrg: {
      type: Object,
      default: () => {}
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
  mounted() {
    this.loadDepartmentType();
    // this.loadPositionLevels();
    // this.loadPositionFunctions();
  },
  data() {
    return {
      departmentTypes: []
    };
  },
  methods: {
     ...mapActions("wordbook", ["getWordbookitemByCode"]),  
    loadDepartmentType() {
      this.getWordbookitemByCode(deptTypeCode).then(data => {
        this.departmentTypes = data;
      });
    },
    // loadPositionLevels() {
    //   this.getWordbookitemByCode(positionLevelCode).then(data => {
    //     this.positionLevels = data;
    //   });
    // },
    // loadPositionFunctions() {
    //   this.getWordbookitemByCode(positionFunctionCode).then(data => {
    //     this.positionFunctions = data;
    //   });
    // }
  }
};
</script>