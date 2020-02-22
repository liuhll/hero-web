<template>
  <span style="width: '100%'" class="menu-tree-node">
    <span>
      <svg-icon v-if="data.mold==0" icon-class="menu" />
      <svg-icon v-if="data.mold==1" icon-class="operation" />
      {{data.title}}
    </span>
    <span>
      <el-button size="mini" type="text" class="menu-node-buttion" icon="el-icon-circle-plus" circle @click="appendNode" v-if="data.operate==0 || data.operate==undefined"></el-button>
      <el-button size="mini" type="text" class="menu-node-buttion" icon="el-icon-edit" circle @click="editNode" v-if="data.operate==0 || data.operate==undefined"></el-button>
      <el-button size="mini" type="text" class="menu-node-buttion" icon="el-icon-delete" circle @click="deleteNode"></el-button>
    </span>
  </span>
</template>

<script>
import Emitter from "@/mixins/emitter.js";
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