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
        <el-select
          v-model="userGroup.roleIds"
          multiple
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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
      roles: [],
    };
  },
  mounted() {
    this.loadRoleData();
  },
  methods: {
    ...mapActions("role", ["list"]),
    loadRoleData() {
      this.list().then((data) => {
        this.roles = data;
      })
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