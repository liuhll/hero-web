<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6" class="block">
        <el-input
          placeholder="请输入组织结构名称进行过滤"
          v-model="filterOrgName"
        ></el-input>
        <el-tree
          :data="orgData"
          default-expand-all
          :render-content="renderContent"
          :expand-on-click-node="false"
          :filter-node-method="filterOrgNode"
          node-key="code"
          @node-click="handleOrgSelected"
          ref="orgTree"
        ></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <corporation-form
            :corporation="corporation"
            :operate="operate"
            v-if="selectedOrg.orgType === 0"
            ref="corporation"
          ></corporation-form>
          <department-form
            :department="department"
            :operate="operate"
            v-if="selectedOrg.orgType === 1"
            ref="department"
          ></department-form>
          <div class="operate-container" v-if="operate !== 0">
            <el-button
              v-loading="loading"
              style="margin-left: 10px;"
              type="success"
              @click="
                operate === 1 ? handleCreateOrgData() : handleEditOrgData()
              "
              >保存</el-button
            >
            <el-button
              v-loading="loading"
              type="warning"
              @click="handleCancleOrgData()"
              >取消</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="请选择组织类型"
      :visible.sync="dialogFormVisible"
      @close="handleDialogClose"
    >
      <check-org-type
        ref="newOrgNode"
        :newOrgNodeData="newOrgNodeData"
      ></check-org-type>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" size="mini" @click="dialogFormVisible = false"
          >取消</el-button
        >
        <el-button type="success" size="mini" @click="handleAppendOrgConfirm"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrgNodeEdit from "@/views/organization/components/org-node-edit.vue";
import CheckOrgType from "./components/check-org-type.vue";
import DepartmentForm from "./components/department-form.vue";
import CorporationForm from "./components/corporation-form.vue";

import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import { isEmpty, findTreeItem, operateType, orgType } from "@/utils";

const deptTypeCode = "DeptType",
  positionLevelCode = "PositionLevel",
  positionFunctionCode = "PositionFunction";

export default {
  components: {
    OrgNodeEdit,
    CheckOrgType,
    DepartmentForm,
    CorporationForm
  },
  data() {
    return {
      filterOrgName: "",
      selectedOrg: {},
      corporation: {},
      department: {},
      orgData: [],
      dialogFormVisible: false,
      haveUnSaveOrgData: false,
      newOrgNodeData: {},
      positionLevels: [],
      positionFunctions: [],
      operate: operateType.Look, // 0. 查看 1. 新增 2. 删除 3.编辑
      hisOperate: undefined,
      loading: false
    };
  },
  watch: {
    selectedOrg(val) {
      if (!isEmpty(val) && val.id) {
        if (val.orgType == orgType.Corporation) {
          this.loadCorporation(val.id);
        } else if (val.orgType == orgType.Department) {
          this.loadDepartment(val.id);
        }
      }
    }
  },
  mounted() {
    this.loadOrgData();
  },
  methods: {
    ...mapActions("organization", [
      "getOrgTree",
      "getDeptPositionByOrgId",
      "getCorporationByOrgId",
      "getDepartmentByOrgId",
      "createDepartment",
      "createCorporation",
      "updateDepartment",
      "updateCorporation",
      "deleteDepartment",
      "deleteCorporation"
    ]),
    ...mapActions("wordbook", ["getWordbookitemByCode"]),
    loadOrgData(orgId) {
      this.getOrgTree().then(data => {
        this.orgData = data;
        let selectedNodeData = data[0];
        if (orgId) {
          selectedNodeData = findTreeItem(
            this.orgData,
            item => item.id == orgId
          );
        }
        if (selectedNodeData) {
          this.operate = operateType.Look;
          this.selectedOrg = selectedNodeData;
        }
      });
    },
    handleDialogClose() {
      this.dialogFormVisible = false;
    },
    handleAppendOrgCreate(node, data) {
      if (!this.haveUnSaveOrgData) {
        this.newOrgNodeData = {};
        this.newOrgNodeData.parentId = data.id;
        this.newOrgNodeData.parentOrgType = data.orgType;
        if (data.orgType === orgType.Department) {
          this.newOrgNodeData.orgType = data.orgType;
        }
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["newOrgNode"].$refs["newOrgNodeForm"].clearValidate()
        })
        
      } else {
        this.$message.error("存在未保存的组织机构");
      }
    },
    handleAppendOrgConfirm() {
      this.$refs["newOrgNode"].$refs["newOrgNodeForm"].validate(valid => {
        if (valid) {
          this.operate = operateType.Add;
          this.dialogFormVisible = false;
          const newOrgData = {
            name: this.newOrgNodeData.name,
            title: this.newOrgNodeData.name,
            orgType: this.newOrgNodeData.orgType,
            children: []
          };
          if (!this.selectedOrg.children) {
            this.$set(this.selectedOrg, "children", []);
          }
          this.selectedOrg.children.push(newOrgData);
          this.selectedOrg = newOrgData;
          this.haveUnSaveOrgData = true;
          if (this.newOrgNodeData.orgType === orgType.Corporation) {
            this.corporation = {
              parentId: this.newOrgNodeData.parentId,
              name: this.newOrgNodeData.name
            };
          } else {
            this.department = {
              parentId: this.newOrgNodeData.parentId,
              name: this.newOrgNodeData.name
            };
          }
        }
      });
    },
    handleOrgSelected(node, data) {
      switch (this.operate) {
        // look
        case operateType.Look:
          this.selectedOrg = node;
          break;
        // add
         case operateType.Add:
          if (node.id) {
            this.$message({
              message: "请先保存数据或取消操作",
              type: "warning"
            });
          }
        // edit
        case operateType.Edit:
          if (
            node.id &&
            node.id != this.selectedOrg.id &&
            !this.haveUnSaveOrgData
          ) {
            this.selectedOrg = node;
            this.haveUnSaveOrgData = true;
          } else {
            this.$message({
              message: "请先保存数据或取消操作",
              type: "warning"
            });
          }

          break;
        // delete
        case operateType.Delete:
          this.operate = operateType.Look;
          break;
      }
    },
    handleCreateOrgData() {
      if (this.newOrgNodeData.orgType === orgType.Corporation) {
        this.$refs["corporation"].$refs["corporationForm"].validate(valid => {
          if (valid) {
            this.createCorporation(this.corporation).then(data => {
              this.$notify({
                title: "成功",
                message: data.tips,
                type: "success",
                duration: 2000
              });
              this.loadOrgData(data.orgId);
              this.haveUnSaveOrgData = false;
            });
          }
        });
      } else {
        this.$refs["department"].$refs["departmentForm"].validate(valid => {
          if (valid) {
            this.createDepartment(this.department).then(data => {
              this.$notify({
                title: "成功",
                message: data.tips,
                type: "success",
                duration: 2000
              });
              this.loadOrgData(data.orgId);
              this.haveUnSaveOrgData = false;
            });
          }
        });
      }
    },
    handleCancleOrgData() {
      if (this.operate === operateType.Add) {
        if (this.selectedOrg.orgType === orgType.Corporation) {
          this.loadOrgData(this.corporation.parentId);
        } else {
          this.loadOrgData(this.department.parentId);
        }
      } else {
        this.loadOrgData(this.selectedOrg.id);
      }
      this.operate = operateType.Add;
      this.haveUnSaveOrgData = false;
    },
    handleEditOrgData() {
      if (this.selectedOrg.orgType === orgType.Corporation) {
        this.$refs["corporation"].$refs["corporationForm"].validate(valid => {
          if (valid) {
            this.updateCorporation(this.corporation).then(data => {
              this.$notify({
                title: "成功",
                message: data.tips,
                type: "success",
                duration: 2000
              });
              this.loadOrgData(data.orgId);
              this.haveUnSaveOrgData = false;
            });
          }
        });
      } else {
        this.$refs["department"].$refs["departmentForm"].validate(valid => {
          if (valid) {
            this.updateDepartment(this.department).then(data => {
              this.$notify({
                title: "成功",
                message: data.tips,
                type: "success",
                duration: 2000
              });
              this.loadOrgData(data.orgId);
              this.haveUnSaveOrgData = false;
            });
          }
        });
      }
    },
    handleDeleteOrg(node, data) {
      this.$confirm(
        `是否删除该${data.orgType === orgType.Corporation ? "公司" : "部门"}?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.operate = operateType.Delete;
          const parent = node.parent;
          // const children = parent.data.children || parent.data;
          // const index = children.findIndex(d => d.id === data.id);
          //children.splice(index, 1);
          //this.selectedOrg = parent.data;

          // parent.checked = true;
          // this.$refs["orgTree"].setCurrentNode(parent);
          // if (!data.id) {
          //   this.haveUnSaveOrgData = false;
          // }
          //debugger;
          if (data.orgType === orgType.Corporation) {
            this.deleteCorporation(data.id).then(reps => {
              this.$notify({
                title: "成功",
                message: "删除公司信息成功",
                type: "success",
                duration: 2000
              });
              this.loadOrgData(parent.data.id);
              this.operate = operateType.Add;
            });
          } else {
            this.deleteDepartment(data.id).then(reps => {
              this.$notify({
                title: "成功",
                message: "删除部门信息成功",
                type: "success",
                duration: 2000
              });
              this.loadOrgData(parent.data.id);
              this.operate = operateType.Add;
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEditOrg(node, data) {
      this.operate = operateType.Edit;
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
        let index = 1;
        if (data.positions) {
          data.positions.forEach(item => {
            item.index = index;
            index++;
          });
        }
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
            this.handleAppendOrgCreate(node, data);
          },
          "on-delete-org": node => {
            this.handleDeleteOrg(node, data);
          },
          "on-edit-org": node => {
            this.handleEditOrg(node, data);
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
.operate-container {
  margin-left: 80px;
}
</style>
