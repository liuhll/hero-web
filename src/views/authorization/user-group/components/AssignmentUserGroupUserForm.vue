<template>
  <div>
    <span style="font-size: 14px; color: red; margin-left: 30px"
      >*Tips: 您可以输入要添加的用户名进行检索</span
    >
    <el-form
      ref="userGroupUserForm"
      style="margin-left: 30px; margin-top: 10px"
      size="mini"
    >
      <el-form-item>
        <hero-transfer
          filterable
          :before-filter="filterUserInfo"
          filter-placeholder="请输入用户名/姓名进行检索"
          :titles="['待选择', '已选择']"
          :button-texts="['移除', '选择']"
          v-model="input.userIds"
          :props="{
            key: 'id',
            label: 'chineseName',
          }"
          :data="userList"
          @change="handleChange()"
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
import HeroTransfer from "@/components/HeroTransfer";
export default {
  name: "AssignmentUserGroupUserForm",
  components: {
    HeroTransfer,
  },
  data() {
    return {
      userList: [],
      query: {
        searchKey: "",
        userIds: {
          include: false,
          ids: [],
        },
        userGroupId: -1,
        pageCount: 10,
        pageIndex: 1,
      },
      input: {
        userGroupId: null,
        userIds: [],
      },
    };
  },
  mounted() {
    this.searchUserInfo();
  },
  methods: {
    ...mapActions("user", ["queryUser"]),
    searchUserInfo() {
      this.queryUser(this.query).then((data) => {
        this.userList = data.items;
      });
    },
    filterUserInfo(title, item) {
      if (title == "待选择") {
        this.query.searchKey = item;
        this.searchUserInfo();
      }
    },
    initInput(data) {
      this.input = data;
      this.query.userGroupId = data.userGroupId;
    },
    handleChange() {
      this.query.userIds.ids = this.input.userIds;
      this.queryUser(this.query).then((data) => {
        this.userList = data.items;
      });
    },
  },
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