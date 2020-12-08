<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="visible"
      width="250px"
      @close="close"
    >
      <div>{{tips}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Delete",
  props: {
    sourceVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    data: {
      type: [String, Number, Object],
      required: true,
    },
    tips: {
      type: String,
      default: ()=> "您确定要删除该条记录吗?"
    },
  },
  data() {
    return {
      visible: false,
    };
  },

  watch: {
    sourceVisible(val) {
      this.visible = val;
    },
  },

  methods: {
    close() {
      this.visible = false;
      this.$emit("on-close", { visible: this.visible });
    },
    confirm() {
      this.visible = false;
      this.$emit("handle", { visible: this.visible, data: this.data });
    },
  },
};
</script>