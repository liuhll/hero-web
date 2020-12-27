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
        <userinfo-page-form ref="userinfo-form" :userInfo="userInfo" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import OrgNode from "@/views/organization/components/OrgNode.vue";
import UserinfoPageForm from "./components/UserinfoPageForm";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { Loading } from "element-ui";
export default {
  name: "Create",
  components: {
    Sticky,
    UserinfoPageForm,
  },
  data() {
    return {
      userInfo: {
        orgId: null,
        positionId: null,
        roleIds: [],
        userGroupIds: []
      },
    };
  },
  methods: {
    ...mapActions("user", ["create"]),
    handleCreate() {
      this.$refs["userinfo-form"].$refs["userInfo"].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            target: ".userinfo",
            text: "保存中...",
          });
          this.userInfo.status = 1;
          this.create(this.userInfo)
            .then((data) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data,
                type: "success",
                duration: 2000,
              });
              this.$nextTick(() => {
                loadingInstance.close();
              });
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.push({ name: "user" });
            })
            .catch((err) => {
              this.$nextTick(() => {
                loadingInstance.close();
              });
              //this.$store.dispatch("tagsView/delView", this.$route);
              //this.$router.push({ name: "user" });
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