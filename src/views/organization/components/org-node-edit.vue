<template>
  <span style="width: '100%'" class="org-tree-node">
    <span>
      <svg-icon v-if="data.orgType==orgType.Corporation" icon-class="corporation" />
      <svg-icon v-if="data.orgType==orgType.Department" icon-class="department" />
      {{data.name}}
    </span>
    <span>
      <el-button
        size="mini"
        type="text"
        class="org-node-buttion"
        icon="el-icon-circle-plus"
        circle
        @click="appendNode"
        v-if="data.operate==operateType.Query || data.operate==undefined"
      ></el-button>
      <el-button
        size="mini"
        type="text"
        class="org-node-buttion"
        icon="el-icon-edit"
        circle
        @click="editNode"
        v-if="data.operate==operateType.Query || data.operate==undefined"
      ></el-button>
      <el-button
        size="mini"
        type="text"
        class="org-node-buttion"
        icon="el-icon-delete"
        circle
        @click="deleteNode"
      ></el-button>
    </span>
  </span>
</template>

<script>
import Emitter from "@/mixins/emitter.js";
import { operateType, orgType } from "@/utils";
export default {
  name: "OrgNodeEdit",
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
      orgType: orgType
    };
  },
  methods: {
    appendNode() {
      this.$emit("on-append-org", this.node, this.data);
    },
    deleteNode() {
      this.$emit("on-delete-org", this.node, this.data);
    },
    editNode() {
      this.$emit("on-edit-org", this.node, this.data);
    }
  }
};
</script>

<style>
.org-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>