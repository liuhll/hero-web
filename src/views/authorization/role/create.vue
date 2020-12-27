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
        <role-page-form ref="role-form" :role="role"></role-page-form>
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
        orgIds: [],
        name: undefined,
        memo: undefined,
        dataPermissionOrgIds: [],
        permissionIds: [],
      },
    };
  },
  methods: {
    ...mapActions("role", ["create", "update"]),
    handleCreate() {
      this.$refs["role-form"].$refs["role"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".el-dialog",
            text: "保存中...",
          });
          this.create(this.role)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
              });
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.push({ name: "role" });
            })
            .catch((err) => {
              this.dialogFormVisible = false;
              this.$nextTick(() => {
                // 以服务的方式调用的 Loading 需要异步关闭
                loadingInstance.close();
              });
            });
        }
      });
    },
    handleCancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>