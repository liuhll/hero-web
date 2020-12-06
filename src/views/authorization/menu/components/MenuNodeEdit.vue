<template>
  <span style="width: '100%'" class="menu-tree-node">
    <span>
      <svg-icon v-if="data.mold==permissionType.Menu" icon-class="menu" />
      <svg-icon v-if="data.mold==permissionType.Operation" icon-class="operation" />
      {{data.title}}
    </span>
    <span>
      <el-button
        size="mini"
        type="text"
        class="menu-node-buttion"
        icon="el-icon-circle-plus"
        circle
        @click="appendNode"
        v-if="(data.operate==operateType.Query || data.operate==undefined) && data.mold==permissionType.Menu"
      ></el-button>
      <el-button
        size="mini"
        type="text"
        class="menu-node-buttion"
        icon="el-icon-edit"
        circle
        @click="editNode"
        v-if="data.operate==operateType.Query  || data.operate==undefined"
      ></el-button>
      <el-button
        size="mini"
        type="text"
        class="menu-node-buttion"
        icon="el-icon-delete"
        circle
        @click="deleteNode"
      ></el-button>
    </span>
  </span>
</template>

<script>
import Emitter from "@/mixins/emitter.js";
import { operateType, permissionType } from "@/utils";
export default {
  name: "menuNodeEdit",
  mixins: [Emitter],
  props: {
    node: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      operateType: operateType,
      permissionType: permissionType
    };
  },
  methods: {
    appendNode() {
      this.$emit("on-append-menu", this.node, this.data);
    },
    deleteNode() {
      this.$emit("on-delete-menu", this.node, this.data);
    },
    editNode() {
      this.$emit("on-edit-menu", this.node, this.data);
    }
  }
};
</script>

<style>
.menu-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>