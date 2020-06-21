<template>
  <div class="app-container">
    <el-form ref="newPermissionNodeForm" :model="newPermissionData" label-position="left" label-width="90px" :rules="rules">
      <el-form-item label="权限类型" prop="mold">
        <el-radio-group v-model="newPermissionData.mold">
          <el-radio :label="0">菜单</el-radio>
          <el-radio :label="1">操作</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="newPermissionData.mold==0" label="菜单名称" prop="menuName">
        <el-input v-model="newPermissionData.name" placeholder="请输入菜单名称" />
      </el-form-item>
       <el-form-item v-else label="操作名称" prop="operationName">
        <el-input v-model="newPermissionData.name" placeholder="请输入操作名称" />
      </el-form-item>
    </el-form>
  </div>  
</template>

<script>
export default {
    name: "CheckPermissionType",
    props: {
        newPermissionData: {
            type: Object,
            default: ()=>{},
        }
    },
    data() {
        return {
            rules: {
                mold: [
                    { required: true, message: "请选择权限类型", trigger: "change" }
                ],
                menuName: [
                    { required: true, message: "请输入菜单名称", trigger: "blur" }
                ],
                operationName: [
                    { required: true, message: "请输入操作名称", trigger: "blur" }
                ]
            }
        }
    }
   
}
</script>

