<template>
  <div class="form-container">
    <el-form
      ref= "operationForm"
      :model="operation"      
      label-position="left"
      label-width="120px"
      :disabled="operate !== operateType.Create && operate !== operateType.Update"
      :rules="rules"
    >
      <el-form-item label="名称" prop="title">
        <el-input v-model="operation.title" />
      </el-form-item>
      <el-form-item label="标识" prop="name">
        <el-input v-model="operation.name" />
      </el-form-item>
      <el-form-item label="操作类型" prop="mold">
        <el-select v-model="operation.mold" placeholder="请选择操作类型" style="width: 100%">
          <el-option
            v-for="item in operationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="operation.icon" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="operation.memo" />
      </el-form-item>
      <el-form-item label="服务API" prop="actions">
        <el-cascader
          v-model="operation.actionIds"
          :show-all-levels="false"
          :options="serviceActionOptions"
          :props="{ multiple: true, emitPath: false }"
          :collapse-tags="true"
          @change="handleSelectedActions"
          clearable
          style="width: 100%"
        ></el-cascader>
        <div class="operation-container">
          <el-table :data="serviceActions" border small highlight-current-row style="width: 100%;">
            <el-table-column prop="serviceHost" label="服务主机名称"></el-table-column>
            <el-table-column prop="application" label="所属应用"></el-table-column>
            <el-table-column prop="serviceId" label="服务Id"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="webApi" label="API路径"></el-table-column>
            <el-table-column prop="developer" label="开发者"></el-table-column>
            <el-table-column prop="date" label="维护日期"></el-table-column>
            <!-- <el-table-column label="操作" min-width="100" v-if="operate !== operateType.Query">
              <template slot-scope="{ row }">
                <el-button type="danger" size="mini" @click="deleteServiceAction(row)">移除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { operateType } from "@/utils";
import { mapActions } from "vuex";
const operationOptions = [
  // {
  //   value: operateType.Query,
  //   label: "查询"
  // },
  {
    value: operateType.Look,
    label: "查看详情"
  },  
  {
    value: operateType.Create,
    label: "新增"
  },
  {
    value: operateType.Update,
    label: "修改"
  },
  {
    value: operateType.Delete,
    label: "删除"
  },
  {
    value: operateType.Other,
    label: "其他"
  }
];
export default {
  props: {
    operation: {
      type: Object,
      default: () => {}
    },
    operate: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        name: [{ required: true, message: "请输入标识", trigger: "blur" }],
        mold: [{ required: true, message: "请选择操作类型", trigger: "change" }]
      },
      operateType: operateType,
      operationOptions: operationOptions,
      serviceActionOptions: [],
      serviceActions: [],
      selectedOperationActionIds: []
    };
  },
  watch: {
    selectedOperationActionIds(val) {
      this.loadServiceActionTableData(val);
    }
  },
  mounted() {
    if (!this.operation.actionIds) {
      this.operation.actionIds = [];
    }
    this.loadServiceActions();
    this.loadServiceActionTableData(this.operation.actionIds)
  },
  methods: {
    ...mapActions("action", ["getServiceActionTree", "getServiceAction"]),
    loadServiceActions() {
      this.getServiceActionTree().then(data => {
        this.serviceActionOptions = data;
      });
    },
    loadServiceActionTableData(actionIds) {
      this.getServiceAction({
        ids: actionIds
      }).then(data => {
        this.serviceActions = data;
      });
    },
    deleteServiceAction(row) {
      let index = this.operation.actionIds.indexOf(row.id);
      this.operation.actionIds.splice(index, 1);
    },
    handleSelectedActions(val) {
      if (val) {
        this.selectedOperationActionIds = val;
      } else {
        this.selectedOperationActionIds = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.operation-container {
  padding: 20px 0;
}
</style>