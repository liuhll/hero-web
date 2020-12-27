<template>
    <div>
    <el-row>
      <el-col>
        <sticky
          :z-index="10"
          class-name="sub-navbar"
          style="margin-bottom: 10px"
        >
          <el-button
            style="margin-left: 10px"
            type="success"
            @click="handleCreate()"
            >保存</el-button
          >
          <el-button
            style="margin-left: 10px"
            type="warning"
            @click="handleCancel()"
            >取消</el-button
          >
        </sticky>
      </el-col>
      <el-col :span="14" :push="5">
       <role-page-form :role="role"></role-page-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import OrgNode from "@/views/organization/components/OrgNode.vue";
import RolePageForm from "./components/RolePageForm";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { Loading } from "element-ui";
export default {
  components: { RolePageForm, Sticky },
  data() {
      return {
          role: {
            orgIds: []

          }
      }
  }

}
</script>

<style>

</style>