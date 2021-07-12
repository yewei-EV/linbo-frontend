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
  </div>
</template>
<script>
import {getInfo, updateProfileInfo} from "../../../api/login";
import {defaultProfile} from "../../../dto/options";
import SingleUpload from '../../../components/Upload/singleUpload';

export default {
  name: 'profileEdit',
  components:{SingleUpload},
  data() {
    return {
      userInfo: null,
      profile: Object.assign({}, defaultProfile)
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
<style>
.app-container {
  margin-top: 40px;
}
.address-field {
  text-align: center;
  margin-top: 20px;
}
</style>


