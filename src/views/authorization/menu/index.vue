<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input class="left-item" v-model="filterMenuName" placeholder="请输入菜单或是操作"></el-input>
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
            ref="menu"
            v-if="selectedPermission.mold === 0"
            :menu="menu"
            :operate="operate"
          ></menu-form>
          <operation-from ref="operation" v-else :operation="operation" :operate="operate"></operation-from>
        </div>
        <div class="operate-container" v-if="operate !== 0">
          <el-button
            v-loading="loading"
            style="margin-left: 10px;"
            type="success"
            @click="
                operate === 1 ? handleCreate() : handleUpdate()
              "
          >保存</el-button>
          <el-button v-loading="loading" type="warning" @click="handleCancle()">取消</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="请选择权限类型" :visible.sync="dialogFormVisible" @close="handleDialogClose">
      <check-permission-type
        ref="newPermission"
        :selectedPermission="selectedPermission"
        :newPermissionData="newPermissionData"
      ></check-permission-type>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" size="mini" @click="handleAppendPermissionConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import { isEmpty, findTreeItem, permissionType, operateType } from "@/utils";
import { Loading } from "element-ui";

import MenuNodeEdit from "./components/menu-node-edit.vue";
import MenuForm from "./components/menu-form.vue";
import OperationFrom from "./components/operation-form.vue";
import CheckPermissionType from "./components/check-permission-type.vue";

export default {
  components: {
    MenuNodeEdit,
    MenuForm,
    OperationFrom,
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
      operate: operateType.Look, // 0. 查看 1. 新增 2. 删除 3.编辑
      loading: false
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
      ;
      if (!isEmpty(val) && val.id) {
        if (val.mold == permissionType.Menu) {
          this.loadMenuData(val.id);
        } else if (val.mold == permissionType.Operation) {
          this.loadOperationData(val.id);
        }
      }
    }
  },
  methods: {
    ...mapActions("menu", [
      "getTree",
      "getMenu",
      "getOperation",
      "createMenu",
      "updateMenu",
      "deletePermission"
    ]),
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
          this.operate = operateType.Look;
          this.selectedPermission = selectedNodeData;
        }
      });
    },
    handleMenuSelected(node, data) {
      switch (this.operate) {
        // look
        case operateType.Look:
          this.selectedPermission = node;
          break;
        // add
        case operateType.Add:
          if (node.id) {
            this.$message({
              message: "请先保存数据或取消操作",
              type: "warning"
            });
          }
          break;
        // edit
        case operateType.Edit:
          if (
            node.id &&
            node.id != this.selectedPermission.id &&
            !this.haveUnSavePermissionData
          ) {
            this.selectedPermission = node;
            this.haveUnSavePermissionData = true;
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
    handleAppendMenu(node, data) {
      if (!this.haveUnSavePermissionData) {
        this.newPermissionData = {};
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["newPermission"].$refs[
            "newPermissionNodeForm"
          ].clearValidate();
        });
      } else {
        this.$message.error("存在未保存的数据");
      }
    },
    handleAppendPermissionConfirm() {
      this.$refs["newPermission"].$refs["newPermissionNodeForm"].validate(
        valid => {
          if (valid) {
            this.operate = operateType.Add;
            this.dialogFormVisible = false;
            let newPermissionData = {
              title: this.newPermissionData.name,
              mold: this.newPermissionData.mold,
              children: []
            };
            if (!this.selectedPermission.children) {
              this.$set(this.selectedPermission, "children", []);
            }
            if (this.newPermissionData.permissionLevel === 0) {
              newPermissionData.parentId = 0;
              this.menuData.push(newPermissionData);
            } else {
              newPermissionData.parentId = this.selectedPermission.id;
              this.selectedPermission.children.push(newPermissionData);
            }
            this.selectedPermission = newPermissionData;
            if (this.selectedPermission.mold == permissionType.Menu) {
              this.menu = {};
              this.menu.parentId = newPermissionData.parentId;
              this.menu.title = newPermissionData.title;
            } else {
              this.operation = {};
              this.operation.parentId = newPermissionData.parentId;
              this.operation.title = newPermissionData.title;
            }
          }
        }
      );
    },
    handleEditMenu(node, data) {
      this.operate = operateType.Edit;
    },
    handleDialogClose() {
      this.newPermissionData = {};
      this.dialogFormVisible = false;
    },
    filterMenuNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    loadMenuData(id) {
      let loading = Loading.service({
        target: ".filter-container",
        fullscreen: false
      });
      this.getMenu(id).then(data => {
        this.menu = data;
        setTimeout(() => {
          loading.close();
        }, 200);
      });
    },
    loadOperationData(id) {
      this.getOperation(id).then(data => {
        this.operation = data;
      });
    },
    handleCreate() {
      if (this.selectedPermission.mold == permissionType.Menu) {
        this.handleCreateMenu();
      } else {
        this.handleCreateOperation();
      }
    },
    handleCreateMenu() {
      this.$refs["menu"].$refs["menuForm"].validate(valid => {
        if (valid) {
          this.createMenu(this.menu).then(data => {
            this.$notify({
              title: "成功",
              message: data.tips,
              type: "success",
              duration: 2000
            });
            this.loadMenuTreeData(data.permissionId);
            this.haveUnSavePermissionData = false;
          });
        }
      });
    },
    handleCreateOperation() {},
    handleUpdate() {
      if (this.selectedPermission.mold == permissionType.Menu) {
        this.handleUpdateMenu();
      } else {
        this.handleUpdateOperation();
      }
    },
    handleUpdateMenu() {
      this.$refs["menu"].$refs["menuForm"].validate(valid => {
        if (valid) {
          this.updateMenu(this.menu).then(data => {
            this.$notify({
              title: "成功",
              message: data.tips,
              type: "success",
              duration: 2000
            });
            this.loadMenuTreeData(data.permissionId);
            this.haveUnSavePermissionData = false;
          });
        }
      });
    },
    handleUpdateOperation() {},
    handleDeleteMenu(node, data) {
      this.$confirm(
        `是否删除该${data.mold === permissionType.Menu ? "菜单" : "操作"}?`,
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

          if (data.mold === permissionType.Menu) {
            this.deletePermission({
              id: data.id,
              mold: permissionType.Menu
            }).then(reps => {
              this.$notify({
                title: "成功",
                message: "删除菜单信息成功",
                type: "success",
                duration: 2000
              });
              this.loadMenuTreeData(parent.data.id);
              this.operate = operateType.Look;
            });
          } else {
            
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
