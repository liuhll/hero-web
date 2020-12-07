<template>
  <div>
    <el-row>
      <el-col>
        <sticky
          :z-index="10"
          class-name="sub-navbar"
          style="margin-bottom: 10px"
        >
          <el-button style="margin-left: 10px" type="success">保存</el-button>
          <el-button style="margin-left: 10px" type="warning">取消</el-button>
        </sticky>
      </el-col>
      <el-col :span="14" :push="5">
        <userinfo-page-form ref="userinfo-form" :userInfo="userInfo" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import waves from "@/directive/waves"; // waves directive
import OrgNode from "@/views/organization/components/OrgNode.vue";
import UserinfoPageForm from "./components/UserinfoPageForm";
import Sticky from "@/components/Sticky"; // 粘性header组件
export default {
  name: "UserinfoCreateOrUpdate",
  components: {
    Sticky,
    UserinfoPageForm
  },
  props: {},
  data() {
    return {
      userInfo: {
        orgId: null,
        positionId: null,
        roleIds: [],
      },
    };
  },
};
</script>

<style>
</style>