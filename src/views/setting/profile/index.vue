<template> 
  <div class="app-container">
    <el-form :inline="true" :model="profile"
             ref="addressInfoForm"
             label-width="180px" size="small">
      <el-row :gutter="20" class="address-field">
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="20" class="address-field">-->
<!--            <el-form-item label="头像：" prop="附件">-->
<!--              <single-upload v-model="profile.icon"></single-upload>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-col :span="20">
          <el-form-item label="邮箱:">
            <el-input v-model="profile.email" style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="address-field">
          <el-form-item label="Discord ID：">
            <el-input v-model="profile.discordId" style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="24" style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="handleDialogConfirm()" size="large" style="width: 80px">保 存</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" style="text-align: center; margin-top: 40px">
        <el-button type="info" @click="handleChangePassword()" size="large" style="width: 120px">更改密码</el-button>
      </el-col>
    </el-row>
    <el-dialog :title="'更改密码'" :visible.sync="changePasswordDialogVisible" width="40%">
      <el-form ref="passwordForm" label-width="150px" size="small">
        <el-form-item label="旧密码：">
          <el-input v-model="oldPassword" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input v-model="newPassword" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePasswordDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handlePasswordDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getInfo, updateProfileInfo, updatePassword} from "../../../api/login";
import {defaultProfile} from "../../../dto/options";
import SingleUpload from '../../../components/Upload/singleUpload';

export default {
  name: 'profileEdit',
  components:{SingleUpload},
  data() {
    return {
      userInfo: null,
      profile: Object.assign({}, defaultProfile),
      changePasswordDialogVisible: false,
      newPassword: null,
      oldPassword: null
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
        updateProfileInfo(this.userInfo.id, this.profile).then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        });
      })
    },
    handleChangePassword() {
      this.changePasswordDialogVisible = true;
    },
    handlePasswordDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updatePassword(
          {
            "newPassword": this.newPassword,
            "oldPassword": this.oldPassword,
            "username": this.userInfo.username
          }
        ).then(() => {
          this.$message({
            type: 'success',
            message: '更改成功!'
          });
          this.changePasswordDialogVisible = false;
        });
      })
    },
    getUserInfo() {
      getInfo().then(response => {
        this.userInfo = response.data;
        this.profile.email = response.data.email;
        this.profile.discordId = response.data.discordId;
        this.profile.icon = response.data.icon;
      });
    }
  }
}
</script>
<style scoped>
.app-container {
  margin-top: 40px;
}
.address-field {
  text-align: center;
  margin-top: 20px;
}
</style>


