<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable"
                :data="addressList"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="收件人姓名" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.receiverName}}</template>
        </el-table-column>
        <el-table-column label="收件人电话" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.phoneNumber}}</template>
        </el-table-column>
        <el-table-column label="地址" min-width="400" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button size="mini"
                         type="text"
                         @click="handleUpdate(scope.row)">
                编辑
              </el-button>
              <el-button size="mini"
                         type="text"
                         @click="handleDelete(scope.$index, scope.row)">
                删除
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="isEdit?'编辑地址':'添加地址'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="addressInfo"
               ref="addressForm"
               label-width="150px" size="small">
        <el-form-item label="收件人姓名：">
          <el-input v-model="addressInfo.receiverName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="收件人电话：">
          <el-input v-model="addressInfo.phoneNumber" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="收件地址：">
          <el-input v-model="addressInfo.address"
                    type="textarea"
                    :rows="5"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  allocateAddress,
  createAddress,
  deleteAddress,
  getInfo,
  updateAddress
} from "../../../api/login";
import {defaultAddressInfo} from "../../../dto/options";

export default {
  name: 'addressEdit',
  data() {
    return {
      userInfo: null,
      listLoading: false,
      isEdit: false,
      addressList: null,
      addressInfo: Object.assign({}, defaultAddressInfo),
      dialogVisible: false
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    handleAdd() {
      this.addressInfo = Object.assign({}, defaultAddressInfo);
      this.isEdit = false;
      this.dialogVisible = true;
    },
    handleUpdate(row) {
      this.isEdit = true;
      this.addressInfo = Object.assign({}, row);
      this.dialogVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该地址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAddress(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getUserInfo();
        });
      });
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.checkAllFieldsFilled()) {
          this.$message({
            type: 'error',
            message: '请填写全部参数!'
          });
          return;
        }
        if (this.isEdit) {
          updateAddress(this.addressInfo).then(() => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.isEdit = false;
            this.getUserInfo();
          })
        } else {
          createAddress(this.addressInfo).then(result => {
            allocateAddress(this.userInfo.id, result.data).then(() => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.addressInfo = Object.assign({}, defaultAddressInfo);
              this.getUserInfo();
            });
          });
        }
      })
    },
    getUserInfo() {
      this.listLoading = true;
      getInfo().then(response => {
        this.userInfo = response.data;
        this.userSn = response.data.userSn;
        this.addressList = response.data.addressList;
        this.listLoading = false;
      });
    },
    checkAllFieldsFilled() {
      return !(!this.addressInfo.receiverName || !this.addressInfo.phoneNumber || !this.addressInfo.address);
    }
  }
}
</script>
<style>
</style>


