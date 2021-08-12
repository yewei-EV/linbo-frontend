<template> 
  <div class="app-container">
    <el-form :inline="true" :model="announcement"
             ref="announcementForm"
             label-width="180px" size="small">
      <el-row :gutter="20" class="announcement-field">
        <el-col :span="20">
          <el-form-item label="公告:">
            <el-input v-model="announcement"
                      type="textarea"
                      :rows="5"
                      style="width: 500px"></el-input>
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
import {updateAnnouncement, getAnnouncement} from "../../../api/login";

export default {
  name: 'announcementEdit',
  data() {
    return {
      announcement: null,
    }
  },
  created() {
    this.getAnnouncement();
  },
  methods: {
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateAnnouncement(this.announcement).then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        });
      })
    },
    getAnnouncement() {
      getAnnouncement().then(response => {
        this.announcement = response.data;
      });
    }
  }
}
</script>
<style>
.app-container {
  margin-top: 40px;
}
.announcement-field {
  text-align: center;
  margin-top: 20px;
}
</style>


