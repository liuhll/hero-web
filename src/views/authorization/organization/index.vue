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
          node-key="code"
          @node-click="handleOrgSelected"
          ref="orgTree"
        ></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <corporation-form
            :corporation="corporation"
            :selectedOrg="selectedOrg"
            v-if="selectedOrg.orgType === 0"
          ></corporation-form>
          <department-form
            :department="department"
            :selectedOrg="selectedOrg"
            v-if="selectedOrg.orgType === 1"
          ></department-form>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="请选择组织类型" :visible.sync="dialogFormVisible" @close="handleDialogClose">
      <check-org-type ref="newOrgNode" :newOrgNodeData="newOrgNodeData"></check-org-type>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" size="mini" @click="handleAppendOrgConfirm">确认</el-button>
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
import { isEmpty } from "@/utils";
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
      positionFunctions: []
    };
  },
  watch: {
    selectedOrg(val) {
      if (!isEmpty(val) && val.id) {
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
          firstNode.operate = 0;
          this.selectedOrg = firstNode;
        }
      });
    },
    handleDialogClose() {
      this.dialogFormVisible = false;
    },
    handleAppendOrgCreate(node, data) {
      if (!this.haveUnSaveOrgData) {
        this.newOrgNodeData = {};
        this.newOrgNodeData.parentOrgType = data.orgType;
        if (data.orgType === 1) {
          this.newOrgNodeData.orgType = data.orgType;
        }
        this.dialogFormVisible = true;
      } else {
        this.$message.error("存在未保存的组织机构");
      }
    },
    handleAppendOrgConfirm() {
      this.$refs["newOrgNode"].$refs["newOrgNodeForm"].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;

          const newOrgData = {
            name: this.newOrgNodeData.name,
            title: this.newOrgNodeData.name,
            orgType: this.newOrgNodeData.orgType,
            operate: 1,
            children: []
          };
          if (!this.selectedOrg.children) {
            this.$set(this.selectedOrg, "children", []);
          }
          this.selectedOrg.children.push(newOrgData);
          this.haveUnSaveOrgData = true;
        }
      });
    },
    handleOrgSelected(node, data) {
      debugger;
      node.operate = 0;
      this.selectedOrg = node;
    },
    handleDeleteOrg(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      // debugger;
      // this.selectedOrg = parent.data;
      // this.selectedOrg.operate = 2;
      parent.checked = true;
      this.$refs["orgTree"].setCurrentNode(parent);
      if (!data.id) {
        this.haveUnSaveOrgData = false;
      }
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
            this.handleAppendOrgCreate(node, data);
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