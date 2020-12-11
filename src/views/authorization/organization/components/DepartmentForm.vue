<template>
  <div class="form-container">
    <el-form
      ref="departmentForm"
      label-position="left"
      label-width="90px"
      :model="department"
      :disabled="operate !== operateType.Create && operate !== operateType.Update"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="department.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门类型" prop="deptTypeId">
        <el-select v-model="department.deptTypeId">
          <el-option
            v-for="item in departmentTypes"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="办公区域" prop="location">
        <el-input v-model="department.location" />
      </el-form-item>
      <el-form-item label="部门简介" prop="briefIntro">
        <el-input type="textarea" v-model="department.briefIntro" />
      </el-form-item>
      <el-form-item label="职位信息" prop="positions">
        <el-button
          type="success"
          icon="el-icon-plus"
          v-if="operate !== operateType.Query"
          @click="createPosition"
        >新增</el-button>
        <div class="department-container">
          <el-table
            :data="department.positions"
            border
            small
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column prop="name" label="职位名称"></el-table-column>
            <el-table-column prop="functionName" label="职能"></el-table-column>
            <el-table-column prop="positionLevelName" label="职位级别"></el-table-column>
            <el-table-column label="是否部门负责人">
              <template slot-scope="{ row }">
                <el-tag :type="row.isLeadershipPost | statusTagFilter">
                  {{
                  row.isLeadershipPost | statusFilter
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否领导人岗位">
              <template slot-scope="{ row }">
                <el-tag :type="row.isLeadingOfficial | statusTagFilter">
                  {{
                  row.isLeadingOfficial | statusFilter
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="postResponsibility" label="岗位职责"></el-table-column>
            <el-table-column label="操作" min-width="100" v-if="operate !== operateType.Query">
              <template slot-scope="{ row }">
                <el-button type="primary" size="mini" @click="updatePosition(row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deletePosition(row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <position-form :position="editPosition" ref="position"></position-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            dialogStatus === 'create'
              ? createPositionData()
              : updatePositionData()
          "
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PositionForm from "./PositionForm.vue";
import { operateType } from "@/utils";
const deptTypeCode = "DeptType",
  positionLevelCode = "PositionLevel",
  positionFunctionCode = "PositionFunction";
const defaultPosition = {
  deptId: undefined,
  name: "",
  functionId: undefined,
  positionLevelId: undefined,
  briefIntro: "",
  postResponsibility: ""
};
export default {
  components: {
    PositionForm
  },
  props: {
    department: {
      type: Object,
      default: () => {}
    },
    operate: {
      type: Number,
      default: () => 0
    }
  },
  filters: {
    statusTagFilter(val) {
      const statusTagMap = ["success", "danger"];
      if (val) {
        return statusTagMap[0];
      } else {
        return statusTagMap[1];
      }
    },
    statusFilter(val) {
      const statusMap = ["是", "否"];
      if (val) {
        return statusMap[0];
      } else {
        return statusMap[1];
      }
    }
  },
  mounted() {
    this.loadDepartmentType();
  },
  data() {
    return {
      departmentTypes: [],
      loading: false,
      dialogStatus: "",
      dialogFormVisible: false,
      textMap: {
        update: "编辑岗位",
        create: "新增岗位"
      },
      editPosition: {},
      operateType: operateType
    };
  },
  methods: {
    ...mapActions("wordbook", ["getWordbookitemByCode"]),
    ...mapActions("organization", ["checkCanDeletePosition"]),
    loadDepartmentType() {
      this.getWordbookitemByCode(deptTypeCode).then(data => {
        this.departmentTypes = data;
      });
    },
    createPosition() {
      this.editPosition = Object.assign({}, defaultPosition);
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    updatePosition(data) {
      this.editPosition = data; //Object.assign(data, defaultPosition);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    deletePosition(row) {
      this.$confirm("是否删除该岗位?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          debugger
          if (!row.id) {
            let index = this.department.positions.indexOf(row);
            this.department.positions.splice(index, 1);
            this.$message({
              type: "success",
              message: "移除职位信息成功,保存后生效"
            });
          }else{
            this.checkCanDeletePosition(row.id).then(data => {
              debugger
              if (data) {
                let index = this.department.positions.indexOf(row);
                this.department.positions.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "移除职位信息成功,保存后生效"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "该职位已被分配用户,需要先删除相关用户才可以删除该职位"
                });
              }
            });
          }

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    createPositionData() {
      this.$refs["position"].$refs["positionForm"].validate(valid => {
        if (valid) {
          if (!this.department.positions) {
            this.department.positions = [];
          }
          const exsitPostion = this.department.positions.find(
            p => p.name === this.editPosition.name
          );
          if (exsitPostion != undefined) {
            this.$message.error(
              `已经存在${exsitPostion.name}的岗位信息,请不要重复添加`
            );
          } else {
            const positionMax = this.department.positions
              .sort((a, b) => a.index - b.index)
              .slice(-1)[0];
            if (positionMax) {
              this.editPosition.index = positionMax.index + 1;
            } else {
              this.editPosition.index = 1;
            }
            this.department.positions.push(this.editPosition);
            this.dialogFormVisible = false;
            this.$message({
              message: `新增${this.editPosition.name}岗位`,
              type: "success",
              duration: 2000
            });
          }
        }
      });
    },
    updatePositionData() {
      this.$refs["position"].$refs["positionForm"].validate(valid => {
        if (valid) {
          if (!this.department.positions) {
            this.department.positions = [];
          }
          const exsitPostion = this.department.positions.find(
            p =>
              p.name === this.editPosition.name &&
              p.index !== this.editPosition.index
          );
          if (exsitPostion != undefined) {
            this.$message.error(
              `已经存在${exsitPostion.name}的岗位信息,请不要重复添加`
            );
          } else {
            let updatePositionItem = this.department.positions.find(
              p => p.index == this.editPosition.index
            );
            let index = this.department.positions.indexOf(updatePositionItem);
            this.department.positions[index] = this.editPosition;
            this.dialogFormVisible = false;
            this.$message({
              message: `更新${this.editPosition.name}岗位`,
              type: "success",
              duration: 2000
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
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
.department-container {
  padding: 20px 0;
}
</style>
