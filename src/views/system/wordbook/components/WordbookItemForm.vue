<template>
  <div class="form-container">
    <el-form
      ref="wordbookItemForm"
      label-position="left"
      label-width="130px"
      :model="wordbookItem"
      :rules="rules"
      :disabled="dialogStatus === 'look'"
    >
      <el-form-item label="字典项标识" prop="key">
        <el-input v-model="wordbookItem.key" placeholder="请输入字典项唯一标识" />
      </el-form-item>
      <el-form-item label="字典项值" prop="value">
        <el-input v-model="wordbookItem.value" placeholder="请输入字典项值" />
      </el-form-item>      
      <el-form-item prop="sort" label="排序">
        <el-input v-model="wordbookItem.sort" placeholder="字典项排序" />
      </el-form-item>
      <el-form-item label="备注" prop="memo" >
        <el-input type="textarea" v-model="wordbookItem.memo" placeholder="字典项备注" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "WordbookForm",
  props: {
    dialogStatus: String,
  },
  data() {
    return {
      rules: {
        key: [
          {
            required: true,
            message: "字典项标识不允许为空",
            trigger: "blur",
          },
        ],
        value: [
          {
            required: true,
            message: "字典项值不允许",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "字典类型不允许为空", trigger: "change" },
          { required: true, message: "字典类型不允许为空", trigger: "blur" },
        ],                
      },
      loading: false,
      wordbookItemTypes: [{
        id: 1,
        name: '系统类'
      },{
        id: 2,
        name: '业务类'
      }],
      wordbookItem: {
        wordbookId: undefined
      },
    };
  },
  methods: {
    initInput(data) {
      this.wordbookItem = data;
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