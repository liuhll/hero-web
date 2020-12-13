<template>
  <div class="form-container">
    <el-form
      ref="positionForm"
      label-position="left"
      label-width="120px"
      :model="position"
      :rules="rules"
    >
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="position.name" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位职能" prop="functionKey">
        <el-select
          v-model="position.functionKey"
          placeholder="请选择岗位职能"
          @change="onPositionFunctionChange"
        >
          <el-option
            v-for="item in positionFunctions"
            :key="item.key"
            :label="item.value"
            :value="item.key"           
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位级别" prop="positionLevelKey">
        <el-select
          v-model="position.positionLevelKey"
          placeholder="请选择岗位级别"
          @change="onPositionLevelChange"
        >
          <el-option
            v-for="item in positionLevels"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否部门负责人" prop="isLeadershipPost">
        <el-radio-group v-model="position.isLeadershipPost">
          <el-radio :label="true" value>是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否领导岗位" prop="isLeadingOfficial">
        <el-radio-group v-model="position.isLeadingOfficial">
          <el-radio :label="true" value>是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="职责" prop="postResponsibility">
        <el-input
          v-model="position.postResponsibility"
          type="textarea"
          placeholder="请输入岗位职责"
          style="width:100%"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
const positionFunctionCode = "PositionFunction",
  positionLevelCode = "PositionLevel";
export default {
  name: "PositionForm",
  props: {
    position: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.loadPositionFunctions();
    this.loadpositionLevels();
  },
  data() {
    return {
      positionFunctions: [],
      positionLevels: [],
      rules: {
        name: [
           { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        functionId: [
          { required: true, message: '请选择岗位职责', trigger: 'change' }
        ],
        positionLevelId: [
          { required: true, message: '请选择岗位级别', trigger: 'change' }
        ],
        isLeadershipPost: [
          { required: true, message: '请选择是否是部门负责人岗位', trigger: 'change' }
        ],
        isLeadingOfficial: [
          { required: true, message: '请选择是否是部门领导人岗位', trigger: 'change' }
        ],
        postResponsibility:[
          { required: true, message: '请输入岗位职责', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions("wordbook", ["getWordbookitemByCode"]),
    loadPositionFunctions() {
      this.getWordbookitemByCode(positionFunctionCode).then(data => {
        this.positionFunctions = data;
      });
    },
    loadpositionLevels() {
      this.getWordbookitemByCode(positionLevelCode).then(data => {
        this.positionLevels = data;
      });
    },
    onPositionFunctionChange(key) { 
      const positionFunction = this.positionFunctions.find(item => item.key == key);
      this.position.functionName = positionFunction.value;
    },
    onPositionLevelChange(key) {
      const positionLevel = this.positionLevels.find(item => item.key == key);
      this.position.positionLevelName = positionLevel.value;
    }
  }
};
</script>
