<template>
  <div class="form-container">
    <el-form
      ref="corporationForm"
      label-position="right"
      label-width="120px"
      :model="corporation"
      :rules="rules"
      :disabled="operate !== operateType.Create && operate !== operateType.Update"
    >
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="corporation.name" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="组织机构标识" prop="identification">
        <el-input v-model="corporation.identification" />
      </el-form-item>        
      <el-form-item label="公司类型" prop="mold">
        <el-radio-group v-model="corporation.mold">
          <el-radio-button label="0">集团</el-radio-button>
          <el-radio-button label="1">单体</el-radio-button>
          <el-radio-button label="2">子公司</el-radio-button>
          <el-radio-button label="3">股份制</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="corporation.address" />
      </el-form-item>
      <el-form-item label="注册日期" prop="registerDate">
        <el-date-picker v-model="corporation.registerDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="开业日期" prop="openDate">
        <el-date-picker v-model="corporation.openDate" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="法人代表" prop="corporateRepresentative">
        <el-input v-model="corporation.corporateRepresentative" />
      </el-form-item>
      <el-form-item label="行业信息" prop="trade">
        <el-input type="textarea" v-model="corporation.trade" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="corporation.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { operateType } from "@/utils";
import { validateIdentification } from "@/utils/validator";
export default {
  props: {
    corporation: {
      type: Object,
      default: () => {}
    },
    operate: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      operateType: operateType,
      rules: {
        name: [
           { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: '请输入组织机构标识', trigger: 'blur' },
          { trigger: "blur", validator: validateIdentification },
        ],
        mold: [
          { required: true, message: '请选择公司类型', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ]
      }      
    };
  }
};
</script>
<style lang="scss" scoped>
// @import "~@/styles/mixin.scss";
// .app-container {
//   position: relative;
//   .app-main-container {
//     padding: 40px 45px 20px 50px;
//     .postInfo-container {
//       position: relative;
//       @include clearfix;
//       margin-bottom: 10px;
//       .postInfo-container-item {
//         float: left;
//       }
//     }
//   }
// }
</style>