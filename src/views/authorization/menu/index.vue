<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="filterMenuName"
          placeholder="请输入菜单或是操作"
        ></el-input>
        <el-tree
          :data="menuData"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterMenuNode"
          :render-content="renderContent"
          node-key="code"
          @node-click="handleMenuSelected"
          ref="menuTree"
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import { isEmpty, findTreeItem, permissionType } from "@/utils";
import MenuNodeEdit from "./components/menu-node-edit.vue";
import MenuForm from "./components/menu-form.vue";

export default {
  components: {
    MenuNodeEdit,
    MenuForm
  },
  data() {
    return {
      filterMenuName: "",
      menuData: [],
      selectedPermission: {},
      menu: {},
      operation: {}
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
      debugger
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
        debugger
        let selectedNodeData = data[0];
        if (permissionId) {
          selectedNodeData = findTreeItem(
            this.menuData,
            item => item.id == permissionId
          );
        }
        if (selectedNodeData) {
          //this.operate = 0;
          this.selectedPermission = selectedNodeData;
        }
      });
    },
    handleMenuSelected() {},
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
