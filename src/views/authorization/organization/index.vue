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
            operate: 0
          };
        }
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
        operate: 0
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