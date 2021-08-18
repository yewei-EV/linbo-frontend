<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 25px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="操作人名称：">
            <el-input v-model="listQuery.userName" class="input-width" placeholder="操作人名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="操作功能：">
            <el-input v-model="listQuery.operation" class="input-width" placeholder="操作功能" clearable></el-input>
          </el-form-item>
          <el-form-item label="操作方法名称：">
            <el-input v-model="listQuery.method" class="input-width" placeholder="操作方法名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="操作后的数据">
            <el-input v-model="listQuery.modifiedData" class="input-width" placeholder="操作后的数据" clearable></el-input>
          </el-form-item>
          <el-form-item label="操作前数据">
            <el-input v-model="listQuery.preModifiedData" class="input-width" placeholder="操作前数据" clearable></el-input>
          </el-form-item>
          <el-form-item label="IP Address">
            <el-input v-model="listQuery.ip" class="input-width" placeholder="IP Address" clearable></el-input>
          </el-form-item>
          <el-form-item label="操作类型: ">
            <el-input v-model="listQuery.operateType" class="input-width" placeholder="操作类型" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table :data="logList"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="操作人名称" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="操作功能" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.operation}}</template>
        </el-table-column>
        <el-table-column label="操作方法名称" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.method}}</template>
        </el-table-column>
        <el-table-column label="操作后Raw数据" min-width="400" align="center">
          <template slot-scope="scope">{{scope.row.modifiedData}}</template>
        </el-table-column>
        <el-table-column label="操作前Raw数据" min-width="400" align="center">
          <template slot-scope="scope">{{scope.row.preModifiedData}}</template>
        </el-table-column>
        <el-table-column label="操作是否成功" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.result}}</template>
        </el-table-column>
        <el-table-column label="执行时间" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.executeTime}}</template>
        </el-table-column>
        <el-table-column label="持续时间" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.duration}}</template>
        </el-table-column>
        <el-table-column label="IP Address" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.ip}}</template>
        </el-table-column>
        <el-table-column label="操作模块" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.module}}</template>
        </el-table-column>
        <el-table-column label="操作类型" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.operateType}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {getLog} from "../../../api/login";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  userName: null,
  operation: null,
  method: null,
  modifiedData: null,
  preModifiedData: null,
  result: null,
  ip: null,
  operateType: null,
};

export default {
  name: 'logList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      logList: [],
      listLoading: false,
    }
  },
  created() {
    this.getLogList();
  },
  methods: {
    getLogList() {
      this.listLoading = true;
      getLog(this.listQuery).then(response => {
        this.logList = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getLogList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getLogList();
    },
  }
}
</script>
<style scoped>
  .pagination-container {
    margin-bottom: 20px;
  }
</style>


