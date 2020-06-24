<template>
  <div class="form-container">
    <el-form
      ref="menuForm"
      label-position="left"
      label-width="90px"
      :model="menu"
      :disabled="operate == operateType.Query"
      :rules="rules"
    >
      <el-form-item label="名称" prop="title">
        <el-input v-model="menu.title" />
      </el-form-item>
      <el-form-item label="标识" prop="name">
        <el-input v-model="menu.name" />
      </el-form-item>
      <el-form-item label="前端路径" prop="path">
        <el-input v-model="menu.path" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="menu.icon" />
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input v-model="menu.component" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="menu.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { operateType } from "@/utils";
export default {
  props: {
    menu: {
      type: Object,
      default: () => {}
    },
    operate: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        name: [{ required: true, message: "请输入标识", trigger: "blur" }]
      },
      operateType: operateType
    };
  }
};
</script>

<style></style>
