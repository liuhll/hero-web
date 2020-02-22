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
        菜单或操作内容
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import { isEmpty, findTreeItem } from "@/utils";
import MenuNodeEdit from "./components/menu-node-edit.vue";
export default {
  components: {
    MenuNodeEdit
  },
  data() {
    return {
      filterMenuName: "",
      menuData: []
    };
  },
  mounted() {
    this.loadMenuData();
  },
  watch: {
    filterMenuName(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  methods: {
    ...mapActions("menu", ["getTree"]),
    loadMenuData(permissionId) {
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
          //this.operate = 0;
          this.selectedOrg = selectedNodeData;
        }
      });
    },
    handleMenuSelected() {},
    filterMenuNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
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
