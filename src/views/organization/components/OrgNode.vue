<template>
  <span style="display: 'inline-block'; width: '100%'" class="el-tree-node__label">
    <svg-icon v-if="data.orgType==0" icon-class="corporation"/>
    <svg-icon v-if="data.orgType==1" icon-class="department"/>
    <span>{{data.name}}</span>
  </span>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
