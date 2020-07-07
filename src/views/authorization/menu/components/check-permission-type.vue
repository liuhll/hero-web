<template>
  <div class="app-container">
    <el-form
      ref="newPermissionNodeForm"
      :model="newPermissionData"
      label-position="left"
      label-width="90px"
      :rules="rules"
    >
      <el-form-item label="权限类型" prop="mold">
        <el-radio-group v-model="newPermissionData.mold">
          <el-radio :label="permissionType.Menu">菜单</el-radio>
          <el-radio :label="permissionType.Operation">操作</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="newPermissionData.mold==permissionType.Menu && selectedPermission.parentPermissionId===0"
        label="菜单层级"
        prop="permissionLevel"
      >
        <el-radio-group v-model="newPermissionData.permissionLevel">
          <el-radio :label="permissionLevel.TopMenu">顶层菜单</el-radio>
          <el-radio :label="permissionLevel.SubMenu">子菜单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="newPermissionData.mold==permissionType.Menu" label="菜单名称" prop="name">
        <el-input v-model="newPermissionData.name" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item v-else label="操作名称" prop="name">
        <el-input v-model="newPermissionData.name" placeholder="请输入操作名称" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { permissionType, permissionLevel } from "@/utils";
export default {
  name: "CheckPermissionType",
  props: {
    newPermissionData: {
      type: Object,
      default: () => {}
    },
    selectedPermission: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        mold: [
          { required: true, message: "请选择权限类型", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
        permissionLevel: [
          { required: true, message: "请选择菜单层级", trigger: "change" }
        ]
      },
      permissionType: permissionType,
      permissionLevel: permissionLevel
    };
  }
};
</script>

