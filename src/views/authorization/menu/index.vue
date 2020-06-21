<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="filterMenuName"
          placeholder="请输入菜单或是操作"
        ></el-input>
        <el-tree
          ref="menuTree"
          :data="menuData"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterMenuNode"
          :render-content="renderContent"
          node-key="code"
          @node-click="handleMenuSelected"
        ></el-tree>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <menu-form
            v-if="selectedPermission.mold === 0"
            :menu="menu"
          ></menu-form>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="请选择权限类型"
      :visible.sync="dialogFormVisible"
      @close="handleDialogClose"
    >
      <check-permission-type :newPermissionData="newPermissionData"></check-permission-type>

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
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import { isEmpty, findTreeItem, permissionType,  operateType } from "@/utils";
import MenuNodeEdit from "./components/menu-node-edit.vue";
import MenuForm from "./components/menu-form.vue";
import CheckPermissionType from "./components/check-permission-type.vue";

export default {
  components: {
    MenuNodeEdit,
    MenuForm,
    CheckPermissionType
  },
  data() {
    return {
      filterMenuName: "",
      menuData: [],
      selectedPermission: {},
      menu: {},
      operation: {},
      haveUnSavePermissionData: false,
      newPermissionData: {},
      dialogFormVisible: false,
    };
  },
  mounted() {
    this.loadMenuTreeData();
  },
  watch: {
    filterMenuName(val) {
      this.$refs.menuTree.filter(val);
    },
    selectedPermission(val) {
      if (!isEmpty(val) && val.id) {
        if (val.mold == permissionType.Menu) {
          this.loadMenuData(val.id);
        } else if (val.orgType == permissionType.Operation) {
          this.loadOperationData(val.id);
        }
      }
    }
  },
  methods: {
    ...mapActions("menu", ["getTree", "getMenu", "getOperation"]),
    loadMenuTreeData(permissionId) {
      this.getTree().then(data => {
        this.menuData = data;
        let selectedNodeData = data[0];
        if (permissionId) {
          selectedNodeData = findTreeItem(
            this.menuData,
            item => item.id == permissionId
          );
        }
        if (selectedNodeData) {
          this.selectedPermission = selectedNodeData;
        }
      });
    },
    handleMenuSelected(node, data) {     
      this.selectedPermission = node;
    },
    handleAppendMenu(node, data) {
      if (!this.haveUnSavePermissionData) {
        this.newPermissionData = {}

        this.dialogFormVisible = true
      }else {
        this.$message.error("存在未保存的数据");
      } 
    },
    handleDialogClose() {
      this.newPermissionData = {}
      this.dialogFormVisible = false
    },
    filterMenuNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    loadMenuData(id) {
      this.getMenu(id).then(data => {
        this.menu = data;
      });
    },
    loadOperationData(id) {
      this.getOperation(id).then(data => {
        this.operation = data;
      });
    },
    renderContent(h, { node, data, store }) {
      return h(MenuNodeEdit, {
        props: {
          node: node,
          data: data
        },
        on: {
          "on-append-menu": node => {
            this.handleAppendMenu(node, data);
          },
          "on-delete-menu": node => {
            this.handleDeleteMenu(node, data);
          },
          "on-edit-menu": node => {
            this.handleEditMenu(node, data);
          }
        }
      });
    }
  }
};
</script>
