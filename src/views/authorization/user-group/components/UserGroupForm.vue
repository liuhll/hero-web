<template>
  <div class="form-container">
    <el-form
      ref="userGroupForm"
      label-position="left"
      label-width="90px"
      :model="userGroup"
      :rules="rules"
      :disabled="dialogStatus === 'look'"
    >
      <el-form-item label="用户组名" prop="name" required>
        <el-input v-model="userGroup.name" placeholder="请输入用户组名" />
      </el-form-item>
      <el-form-item prop="roleIds" label="角色" required>
            <el-tooltip class="item" effect="dark" content="请输入关键字查找要添加的角色" placement="top-start">
                <el-select
                  v-model="userGroup.roleIds"
                  multiple
                  clearable
                  filterable
                  remote
                  :loading="loading"
                  :remote-method="searchRoles"
                  style="width: 100%"
                  placeholder="请输入要添加的角色名称"
                >
                  <el-option
                    v-for="item in roles"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
            </el-tooltip>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="userGroup.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "UserGroupForm",
  props: {
    userGroup: {
      type: Object,
      default: () => {},
    },
    dialogStatus: String,
  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "用户组名不允许为空",
            trigger: "blur",
          },
        ],
      },
      loading: false,
      roles: [],
      queryRole: {
        searchKey: undefined,
        status: 1,
        pageCount: 10,
        pageIndex: 1,
      },       
    };
  },
  methods: {
    ...mapActions("role", ["list", "search"]),
    loadRoleData() {
      this.list().then((data) => {
        this.roles = data;
      })
    },
    searchRoles(key) {
      if (key !== '' || !this.userGroup.roleIds) {
      this.queryRole.searchKey = key;
      this.loadRoleData()
      }
    },
    loadRoleData() {
      this.loading = true;
      this.search(this.queryRole).then((data) => {
        this.totalCount = data.totalCount;
        this.roles = data.items;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false;
        }, 1.5 * 200);
      });
    },    
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