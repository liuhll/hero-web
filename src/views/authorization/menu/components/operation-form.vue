<template>
  <div class="form-container">
    <el-form :model="operation" label-position="left" label-width="120px"  :disabled="operate == 0" :rules="rules">
      <el-form-item label="名称" prop="title">
        <el-input v-model="operation.title" />
      </el-form-item>
      <el-form-item label="标识" prop="name">
        <el-input v-model="operation.name" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="operation.icon" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="operation.memo" />
      </el-form-item>
      <el-form-item label="服务API" prop="actions">
        <el-button
          type="success"
          icon="el-icon-plus"
          v-if="operate !== 0"
          @click="createPosition"
        >新增</el-button>
        <div class="operation-container">
          <el-table
            :data="operation.actions"
            border
            small
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column prop="serviceId" label="服务Id"></el-table-column>
            <el-table-column prop="serviceHost" label="服务主机名称"></el-table-column>
            <el-table-column prop="application" label="所属应用"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="webApi" label="API路径"></el-table-column>
            <el-table-column prop="enableAuthorization" label="是否需要认证"></el-table-column>
            <el-table-column prop="allowPermission" label="是否需要授权"></el-table-column>
            <el-table-column prop="developer" label="开发者"></el-table-column>
            <el-table-column prop="date" label="维护日期"></el-table-column>
            <el-table-column label="操作" min-width="100" v-if="operate !== 0">
              <template slot-scope="{ row }">
                <el-button type="primary" size="mini" @click="updatePosition(row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deletePosition(row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
        name: [{ required: true, message: "请输入标识", trigger: "blur" }]
      }
    };
  }
};
</script>

