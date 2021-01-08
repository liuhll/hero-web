<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>系统设置</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-setting"
          @click="handleSettingConfig"
          v-permission="{ name: 'setting-config' }"
          >修改配置</el-button
        >
      </div>

      <el-row style="margin-top: 18px">
        <el-form
          ref="settingConfigForm"
          :model="settingConfig"
          :rules="rules"
          label-position="left"
          label-width="120px"
          :disabled="!edit"
        >
          <el-col :span="24">
            <el-form-item label="系统名称" prop="sysName">
              <el-input
                v-model="settingConfig.sysName"
                placeholder="请输入系统名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="域名" prop="domainName">
              <el-input
                v-model="settingConfig.domainName"
                placeholder="请输入系统域名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统维护员" prop="administrator">
              <el-input
                v-model="settingConfig.administrator"
                placeholder="请输入系统维护员"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="无权限按钮风格"
              prop="nonPermissionOperationStyle"
            >
              <el-radio-group
                v-model="settingConfig.nonPermissionOperationStyle"
              >
                <el-radio
                  v-for="item in nonPermissionOperationStyleData"
                  :key="item.id"
                  :label="item.id"
                  >{{ item.description }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
        <div class="operate-container" v-if="edit">
          <el-button
            v-loading="loading"
            style="margin-left: 10px"
            type="success"
            @click="handleSettingConfigSave()"
            >保存</el-button
          >
          <el-button
            v-loading="loading"
            type="warning"
            @click="handleCancleSettingConfig()"
            >取消</el-button
          >
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import waves from "@/directive/waves"; // waves directive
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  directives: { waves, permission },
  data() {
    return {
      rules: {
        sysName: [
          {
            required: true,
            message: "系统名称不允许为空",
            trigger: "blur",
          },
        ],
        nonPermissionOperationStyle: [
          {
            required: true,
            message: "无权限按钮风格不允许为空",
            trigger: "change",
          },
        ],
      },
      settingConfig: {},
      edit: false,
      nonPermissionOperationStyleData: [],
    };
  },
  mounted() {
    this.loadNonPermissionOperationStyles();
    this.loadSettingConfig();
  },
  methods: {
    ...mapActions("systemconfig", [
      "getSystemConfig",
      "setSystemConfig",
      "getNonPermissionOperationStyles",
    ]),
    loadSettingConfig() {
      this.getSystemConfig().then((data) => {
        this.settingConfig = data;
      });
    },
    loadNonPermissionOperationStyles() {
      this.getNonPermissionOperationStyles().then((data) => {
        this.nonPermissionOperationStyleData = data;
      });
    },
    handleSettingConfig() {
      this.edit = true;
    },
    handleSettingConfigSave() {
      this.setSystemConfig(this.settingConfig).then((data) => {
        this.$notify({
          title: "成功",
          message: data,
          type: "success",
          duration: 2000,
        });
        this.edit = false;
      });
    },
    handleCancleSettingConfig() {
      this.edit = false;
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 880px;
}
.operate-container {
  margin-left: 150px;
}
</style>