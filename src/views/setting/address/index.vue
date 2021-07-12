<template> 
  <div class="app-container">
    <el-form :inline="true" :model="addressInfo"
             ref="addressInfoForm"
             label-width="180px" size="small">
      <el-row :gutter="20" class="address-field">
        <el-col :span="20">
          <el-form-item label="收件人姓名: ">
            <el-input v-model="addressInfo.name" style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="address-field">
          <el-form-item label="收件人电话: ">
            <el-input v-model="addressInfo.phoneNumber" style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="address-field">
          <el-form-item label="地址: ">
            <el-input v-model="addressInfo.address"
                      type="textarea"
                      :rows="5"
                      style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="24" style="text-align: center; margin-top: 20px">
          <el-button type="primary" @click="handleDialogConfirm()" size="large" style="width: 80px">保 存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {getInfo, updateAddressInfo} from "../../../api/login";
import {defaultAddressInfo} from "../../../dto/options";

export default {
  name: 'addressEdit',
  data() {
    return {
      userInfo: null,
      addressInfo: Object.assign({}, defaultAddressInfo)
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
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
        updateAddressInfo(this.userInfo.id, this.addressInfo).then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        });
      })
    },
    getUserInfo() {
      getInfo().then(response => {
        this.userInfo = response.data;
        this.userSn = response.data.userSn;
        this.addressInfo.name = response.data.name;
        this.addressInfo.phoneNumber = response.data.phoneNumber;
        this.addressInfo.address = response.data.address;
      });
    },
    checkAllFieldsFilled() {
      return !(!this.addressInfo.name || !this.addressInfo.phoneNumber || !this.addressInfo.address);
    }
  }
}
</script>
<style>
.app-container {
  margin-top: 40px;
}
.address-field {
  text-align: center;
  margin-top: 20px;
}
</style>


