<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6" class="block">
        <el-input
          placeholder="请输入组织结构名称进行过滤"
          v-model="filterOrgName"
        ></el-input>
        <el-scrollbar style="height: 600px; width: 100%">
          <el-tree
            :data="orgData"
            default-expand-all
            :render-content="renderContent"
            :expand-on-click-node="false"
            :filter-node-method="filterOrgNode"
            node-key="id"
            @node-click="handleOrgSelected"
            ref="orgTree"
          ></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <corporation-form
            :corporation="corporation"
            :operate="operate"
            v-if="selectedOrg.orgType === orgType.Corporation"
            ref="corporation"
          ></corporation-form>
          <department-form
            :department="department"
            :operate="operate"
            v-if="selectedOrg.orgType === orgType.Department"
            ref="department"
          ></department-form>
          <div
            class="operate-container"
            v-if="
              operate == operateType.Create || operate == operateType.Update
            "
          >
            <el-button
              v-loading="loading"
              style="margin-left: 10px"
              type="success"
              @click="
                operate === operateType.Create
                  ? handleCreateOrgData()
                  : handleEditOrgData()
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
import OrgNodeEdit from "@/views/organization/components/OrgNodeEdit.vue";
import CheckOrgType from "./components/CheckOrgType.vue";
import DepartmentForm from "./components/DepartmentForm.vue";
import CorporationForm from "./components/CorporationForm.vue";
import { Loading } from "element-ui";

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
    CorporationForm,
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
      operate: operateType.Query,
      hisOperate: undefined,
      loading: false,
      operateType: operateType,
      orgType: orgType,
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
    },
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
      "deleteCorporation",
    ]),
    ...mapActions("wordbook", ["getWordbookitemByCode"]),
    loadOrgData(orgId) {
      this.getOrgTree().then((data) => {
        this.orgData = data;
        let selectedNodeData = data[0];
        if (orgId) {
          selectedNodeData = findTreeItem(
            this.orgData,
            (item) => item.id == orgId
          );
        }
        if (selectedNodeData) {
          this.operate = operateType.Query;
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
          this.$refs["newOrgNode"].$refs["newOrgNodeForm"].clearValidate();
        });
      } else {
        this.$message.error("存在未保存的组织机构");
      }
    },
    handleAppendOrgConfirm() {
      this.$refs["newOrgNode"].$refs["newOrgNodeForm"].validate((valid) => {
        if (valid) {
          this.operate = operateType.Create;
          this.dialogFormVisible = false;
          const newOrgData = {
            name: this.newOrgNodeData.name,
            title: this.newOrgNodeData.name,
            orgType: this.newOrgNodeData.orgType,
            children: [],
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
              name: this.newOrgNodeData.name,
            };
          } else {
            this.department = {
              parentId: this.newOrgNodeData.parentId,
              name: this.newOrgNodeData.name,
            };
          }
        }
      });
    },
    handleOrgSelected(node, data) {
      switch (this.operate) {
        // look
        case operateType.Query:
          this.selectedOrg = node;
          break;
        // add
        case operateType.Create:
          if (node.id) {
            this.$message({
              message: "请先保存数据或取消操作",
              type: "warning",
            });
          }
          break;
        // edit
        case operateType.Update:
          if (
            // node.id &&
            // node.id != this.selectedOrg.id &&
            !this.haveUnSaveOrgData
          ) {
            this.selectedOrg = node;
            this.haveUnSaveOrgData = true;
          } else {
            this.$message({
              message: "请先保存数据或取消操作",
              type: "warning",
            });
          }

          break;
        // delete
        case operateType.Delete:
          this.operate = operateType.Query;
          break;
      }
    },
    handleCreateOrgData() {
      if (this.newOrgNodeData.orgType === orgType.Corporation) {
        this.$refs["corporation"].$refs["corporationForm"].validate((valid) => {
          if (valid) {
            this.createCorporation(this.corporation)
              .then((data) => {
                this.$notify({
                  title: "成功",
                  message: data.tips,
                  type: "success",
                  duration: 2000,
                });
                this.loadOrgData(data.orgId);
                this.haveUnSaveOrgData = false;
              })
              .catch((err) => {
                this.haveUnSaveOrgData = false;
                this.operate = operateType.Query;
                this.handleCancleOrgData();
              });
          }
        });
      } else {
        this.$refs["department"].$refs["departmentForm"].validate((valid) => {
          if (valid) {
            this.createDepartment(this.department)
              .then((data) => {
                this.$notify({
                  title: "成功",
                  message: data.tips,
                  type: "success",
                  duration: 2000,
                });
                this.loadOrgData(data.orgId);
                this.haveUnSaveOrgData = false;
              })
              .catch((err) => {
                this.haveUnSaveOrgData = false;
                this.operate = operateType.Query;
                this.handleCancleOrgData();
              });
          }
        });
      }
    },
    handleCancleOrgData() {
      if (this.operate === operateType.Create) {
        if (this.selectedOrg.orgType === orgType.Corporation) {
          this.loadOrgData(this.corporation.parentId);
        } else {
          this.loadOrgData(this.department.parentId);
        }
      } else {
        this.loadOrgData(this.selectedOrg.id);
      }
      this.operate = operateType.Query;
      this.haveUnSaveOrgData = false;
    },
    handleEditOrgData() {
      if (this.selectedOrg.orgType === orgType.Corporation) {
        this.$refs["corporation"].$refs["corporationForm"].validate((valid) => {
          if (valid) {
            this.updateCorporation(this.corporation)
              .then((data) => {
                this.$notify({
                  title: "成功",
                  message: data.tips,
                  type: "success",
                  duration: 2000,
                });
                this.loadOrgData(data.orgId);
                this.haveUnSaveOrgData = false;
              })
              .catch((err) => {
                this.haveUnSaveOrgData = false;
                this.operate = operateType.Query;
                this.handleCancleOrgData();
              });
          }
        });
      } else {
        this.$refs["department"].$refs["departmentForm"].validate((valid) => {
          if (valid) {
            this.updateDepartment(this.department)
              .then((data) => {
                this.$notify({
                  title: "成功",
                  message: data.tips,
                  type: "success",
                  duration: 2000,
                });
                this.loadOrgData(data.orgId);
                this.haveUnSaveOrgData = false;
              })
              .catch((err) => {
                this.haveUnSaveOrgData = false;
                this.operate = operateType.Query;
                this.handleCancleOrgData();
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
          type: "warning",
        }
      )
        .then(() => {
          this.operate = operateType.Delete;
          const parent = node.parent;
          if (data.orgType === orgType.Corporation) {
            this.deleteCorporation(data.id)
              .then((reps) => {
                this.$notify({
                  title: "成功",
                  message: "删除公司信息成功",
                  type: "success",
                  duration: 2000,
                });
                this.loadOrgData(parent.data.id);
              })
              .catch((err) => {
                this.haveUnSaveOrgData = false;
                this.operate = operateType.Query;
                this.handleCancleOrgData();
              });
            this.operate = operateType.Query;
          } else {
            this.deleteDepartment(data.id)
              .then((reps) => {
                this.$notify({
                  title: "成功",
                  message: "删除部门信息成功",
                  type: "success",
                  duration: 2000,
                });
                this.loadOrgData(parent.data.id);
              })
              .catch((err) => {
                this.haveUnSaveOrgData = false;
                this.operate = operateType.Query;
                this.handleCancleOrgData();
              });
            this.operate = operateType.Query;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleEditOrg(node, data) {
      this.operate = operateType.Update;
    },
    filterOrgNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    loadCorporation(id) {
      let loading = Loading.service({
        target: ".filter-container",
        fullscreen: false,
      });
      this.getCorporationByOrgId(id).then((data) => {
        this.corporation = data;
        setTimeout(() => {
          loading.close();
        }, 200);
      });
    },
    loadDepartment(id) {
      let loading = Loading.service({
        target: ".filter-container",
        fullscreen: false,
      });
      this.getDepartmentByOrgId(id).then((data) => {
        this.department = data;
        let index = 1;
        if (data.positions) {
          data.positions.forEach((item) => {
            item.index = index;
            index++;
          });
        }
        setTimeout(() => {
          loading.close();
        }, 200);
      });
    },
    renderContent(h, { node, data, store }) {
      return h(OrgNodeEdit, {
        props: {
          node: node,
          data: data,
        },
        on: {
          "on-append-org": (node) => {
            this.handleAppendOrgCreate(node, data);
          },
          "on-delete-org": (node) => {
            this.handleDeleteOrg(node, data);
          },
          "on-edit-org": (node) => {
            this.handleEditOrg(node, data);
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
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
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}
.el-scrollbar {
  height: 100%;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>

