<template>
  <div class="form-container">
    <el-form
      ref="wordbookForm"
      label-position="left"
      label-width="90px"
      :model="wordbook"
      :rules="rules"
      :disabled="dialogStatus === 'look'"
    >
      <el-form-item label="字典名" prop="name">
        <el-input v-model="wordbook.name" placeholder="请输入字典名" />
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
        <el-input v-model="wordbook.code" placeholder="请输入字典编码" />
      </el-form-item>      
      <el-form-item prop="type" label="字典类型">
        <el-select
          v-model="wordbook.type"
          clearable
          style="width: 100%"
          placeholder="请输入要添加的字典类型"
        >
          <el-option
            v-for="item in wordbookTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="wordbook.memo" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "WordbookForm",
  props: {
    wordbook: {
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
            message: "字典名不允许为空",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "字典编码不允许为空",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "字典类型不允许为空", trigger: "change" },
          { required: true, message: "字典类型不允许为空", trigger: "blur" },
        ],                
      },
      loading: false,
      wordbookTypes: [{
        id: 1,
        name: '系统类'
      },{
        id: 2,
        name: '业务类'
      }],
    };
  },
  methods: {
   
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