<template>
  <div class="form-container">
   <el-form
      ref="userGroupUserForm"
      style="margin-left:30px;"
      size="mini"
    >
      <el-form-item>
        <!-- <el-transfer
          filterable
          :before-filter="filterUserInfo"
          filter-placeholder="请输入用户名/姓名进行检索"
          :titles="['待选择', '已选择']"
          :button-texts="['移除','选择']"
          v-model="userIds"
          :props="{
            key: 'id',
            label: 'chineseName'
          }"          
          :data="userList"
          class="userinfo"
          ref="userInfoTransfer"
          >
        </el-transfer> -->
        <hero-transfer
          filterable
          :before-filter="filterUserInfo"
          filter-placeholder="请输入用户名/姓名进行检索"
          :titles="['待选择', '已选择']"
          :button-texts="['移除','选择']"
          v-model="userIds"
          :props="{
            key: 'id',
            label: 'chineseName'
          }"          
          :data="userList"
          class="userinfo"
          ref="userInfoTransfer"
        ></hero-transfer>
      </el-form-item>
    </el-form>      

  </div>
</template>

<script>
import { mapActions } from "vuex";
import { Loading } from "element-ui";
import { isEmpty } from "@/utils";
import HeroTransfer from "@/components/HeroTransfer"
export default {
  name: "AssignmentUserGroupUserForm",
  components: {
    HeroTransfer
  },
  data() {
    return {
        userList: [],
        query: {
          searchKey: "",
          pageCount: 10,
          pageIndex: 1,            
        },
        userIds: []       
    };
  },
  mounted() {
    this.searchUserInfo()
  },
  methods: {
    ...mapActions("user", [
      "queryUser"
    ]),      
    searchUserInfo() {
      let loadingInstance = Loading.service({
        target: ".userinfo",
        text: "加载中...",
      });
      this.queryUser(this.query).then((data) => {
        this.userList = data.items;
        this.$nextTick(() => {
          loadingInstance.close();
        });
      });
    },
    filterUserInfo(title, item) {
      if (title == '待选择') {
        this.query.searchKey = item
        this.searchUserInfo()
      }
    }    
  }
};
</script>

<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-scrollbar__bar.is-horizontal {
  display: none;
}
</style>