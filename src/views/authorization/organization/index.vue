<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6" class="block">
        <el-input placeholder="请输入组织结构名称进行过滤" v-model="filterOrgName"></el-input>
        <el-tree
          :data="orgData"
          default-expand-all
          :render-content="renderContent"
          :expand-on-click-node="false"
          :filter-node-method="filterOrgNode"
          @node-click="handleOrgSelected"
          ref="orgTree"
        ></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-form
            v-if="selectedOrg.orgType == 0"
            label-position="left"
            label-width="90px"
            :model="corporation"
            :disabled="selectedOrg.edit == false"
          >
            <el-form-item label="公司名称" prop="name" required>
              <el-input v-model="corporation.name" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item label="公司类型" prop="mold" required>
              <el-radio-group v-model="corporation.mold">
                <el-radio-button label="0">集团</el-radio-button>
                <el-radio-button label="1">单体</el-radio-button>
                <el-radio-button label="2">子公司</el-radio-button>
                <el-radio-button label="3">股份制</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="地址" prop="address" required>
              <el-input v-model="corporation.address" />
            </el-form-item>
            <el-form-item label="注册日期" prop="registerDate" required>
              <el-date-picker v-model="corporation.registerDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="开业日期" prop="openDate" required>
              <el-date-picker v-model="corporation.openDate" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="法人代表" prop="corporateRepresentative">
              <el-input v-model="corporation.corporateRepresentative" />
            </el-form-item>
            <el-form-item label="行业信息" prop="trade">
              <el-input type="textarea" v-model="corporation.trade" />
            </el-form-item>
            <el-form-item label="备注" prop="memo">
              <el-input type="textarea" v-model="corporation.memo" />
            </el-form-item>
          </el-form>
          <el-form
            v-if="selectedOrg.orgType == 1"
            label-position="left"
            label-width="90px"
            :model="department"
            :disabled="selectedOrg.edit == false"
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
              <el-row>
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
                    <el-table-column label="职位级别" min-width="80">
                      <template slot-scope="{row}">
                        <el-select v-model="row.positionLevelId">
                          <el-option
                            v-for="item in positionLevels"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="职能" min-width="80">
                      <template slot-scope="{row}">
                        <el-select v-model="row.functionId">
                          <el-option
                            v-for="item in positionFunctions"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
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
                    <el-table-column label="操作" min-width="120">
                      <template slot-scope="{row}">
                        <el-button type="primary" size="mini">编辑</el-button>
                        <el-button type="danger" size="mini">移除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OrgNodeEdit from "@/views/organization/components/org-node-edit.vue";
import CheckOrgType from "./components/check-org-type.vue";
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import { isEmpty } from "@/utils";
const deptTypeCode = "DeptType",
  positionLevelCode = "PositionLevel",
  positionFunctionCode = "PositionFunction";

export default {
  components: {
    OrgNodeEdit,
    CheckOrgType
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
  data() {
    return {
      filterOrgName: "",
      selectedOrg: {},
      corporation: {},
      department: {},
      orgData: [],
      departmentTypes: [],
      positionLevels: [],
      positionFunctions: []
    };
  },
  watch: {
    selectedOrg(val) {
      console.log(val);
      if (!isEmpty(val)) {
        if (val.orgType == 0) {
          this.loadCorporation(val.id);
        } else if (val.orgType == 1) {
          this.loadDepartment(val.id);
        }
      }
    }
  },
  mounted() {
    this.loadOrgData();
    this.loadDepartmentType();
    this.loadPositionLevels();
    this.loadPositionFunctions();
  },
  methods: {
    ...mapActions("organization", [
      "getOrgTree",
      "getDeptPositionByOrgId",
      "getCorporationByOrgId",
      "getDepartmentByOrgId"
    ]),
    ...mapActions("wordbook", ["getWordbookitemByCode"]),
    loadOrgData() {
      this.getOrgTree().then(data => {
        this.orgData = data;
        const firstNode = data[0];
        if (firstNode) {
          this.selectedOrg = {
            id: firstNode.id,
            orgType: firstNode.orgType,
            name: firstNode.name,
            edit: false
          };
        }
      });
    },
    loadDepartmentType() {
      this.getWordbookitemByCode(deptTypeCode).then(data => {
        this.departmentTypes = data;
      });
    },
    loadPositionLevels() {
      this.getWordbookitemByCode(positionLevelCode).then(data => {
        this.positionLevels = data;
      });
    },
    loadPositionFunctions() {
      this.getWordbookitemByCode(positionFunctionCode).then(data => {
        this.positionFunctions = data;
      });
    },
    handleAppendOrg(node, data) {
      const h = this.$createElement;
      if (data.orgType == 0) {
        this.$msgbox({
          title: "请选择组织类型",
          message: h(CheckOrgType, {
            on: {
              "on-checked-orgtype": selectedOrg => {
                console.log(selectedOrg);
                this.selectedOrg = selectedOrg;
              }
            }
          }),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action == "confirm") {
              if (this.selectedOrg.orgType == -1) {
                this.$message.error("请选择您要新增的组织类型");
              } else {
                done();
              }
            } else {
              done();
            }
          }
        }).then(action => {
          if (action == "confirm") {
            let newOrgData = {
              name: this.selectedOrg.name,
              title: this.selectedOrg.name,
              orgType: this.selectedOrg.orgType,
              children: []
            };
            if (!data.children) {
              this.$set(data, "children", []);
            }
            data.children.push(newOrgData);
          }
        });
      }
    },
    handleOrgSelected(node, data) {
      this.selectedOrg = {
        id: node.id,
        orgType: node.orgType,
        name: node.name,
        edit: false
      };
    },
    handleDeleteOrg(node, data) {
      console.log(node);
    },
    filterOrgNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    loadCorporation(id) {
      this.getCorporationByOrgId(id).then(data => {
        this.corporation = data;
      });
    },
    loadDepartment(id) {
      this.getDepartmentByOrgId(id).then(data => {
        this.department = data;
      });
    },
    renderContent(h, { node, data, store }) {
      return h(OrgNodeEdit, {
        props: {
          node: node,
          data: data
        },
        on: {
          "on-append-org": node => {
            this.handleAppendOrg(node, data);
          },
          "on-delete-org": node => {
            this.handleDeleteOrg(node, data);
          }
        }
      });
    }
  }
};
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
</style>