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
          style="float:right;margin-right: 25px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 25px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="ID：">
            <el-input v-model="listQuery.id" class="input-width" placeholder="ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单操作：">
            <el-select v-model="listQuery.orderAction" placeholder="全部" clearable class="input-width">
              <el-option v-for="action in actionOptions"
                         :key="action.value"
                         :label="action.label"
                         :value="action.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运单号：">
            <el-input v-model="listQuery.deliverySn" class="input-width" placeholder="运单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="识别码：">
            <el-input v-model="listQuery.userSn" class="input-width" placeholder="识别码" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.orderStatus" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in orderStatusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.paymentTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="listQuery.note" class="input-width" placeholder="备注" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="订单操作" width="100" align="center">
          <template slot-scope="scope">{{scope.row.orderAction | formatAction}}</template>
        </el-table-column>
        <el-table-column label="重量" width="60" align="center">
          <template slot-scope="scope">{{scope.row.weight}}</template>
        </el-table-column>
        <el-table-column label="重量单位" width="60" align="center">
          <template slot-scope="scope">{{scope.row.weightUnit}}</template>
        </el-table-column>
        <el-table-column label="数量" width="50" align="center">
          <template slot-scope="scope">{{scope.row.amount}}</template>
        </el-table-column>
        <el-table-column label="运单号" width="160" align="center">
          <template slot-scope="scope">{{scope.row.deliverySn}}</template>
        </el-table-column>
        <el-table-column label="识别码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.userSn}}</template>
        </el-table-column>
        <el-table-column label="地址" width="60" align="center">
          <template slot-scope="scope">{{scope.row.destination}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="80" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="80" align="center">
          <template slot-scope="scope">{{orderStatusOptions[scope.row.orderStatus].label}}</template>
        </el-table-column>
        <el-table-column label="价格" width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="支付成功时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.paymentTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="备注" width="100" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="danger"
                       v-if="scope.row.orderStatus===1"
                       @click="handlePayment(scope.row)">已付款
            </el-button>
            <el-button size="mini"
                       type="primary"
                       style="margin-left:0;margin-top:10px;"
                       @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="primary"
                       style="margin-left:0;margin-top:10px;"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑订单':'添加订单'"
      :visible.sync="dialogVisible"
      width="80%">
      <el-form :inline="true" :model="order"
               ref="orderForm"
               label-width="180px" size="small">
        <el-form-item label="订单操作：">
          <el-select v-model="order.orderAction" placeholder="全部" clearable style="width: 250px">
            <el-option v-for="action in actionOptions"
                       :key="action.value"
                       :label="action.label"
                       :value="action.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运单号：">
          <el-input v-model="order.deliverySn" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="识别码：">
          <el-input v-model="order.userSn" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="order.price" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="order.note"
                    type="textarea"
                    :rows="1"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import {formatDate} from '@/utils/date';
import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
import {fetchOrderList,updateOrder,createOrder,deleteOrder} from "../../../api/login";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  id: null,
  orderAction: null,
  deliverySn: null,
  userSn: null,
  destination: null,
  note: null,
  createTime: null,
  orderStatus: null,
  paymentTime: null
};
const defaultOrder = {
  id: null,
  orderAction: null,
  weight: null,
  weightUnit: null,
  deliverySn: null,
  userSn: null,
  amount: null,
  destination: null,
  note: null,
  createTime: null,
  orderStatus: null,
  paymentTime: null
}
export default {
  name: "orderList",
  components:{LogisticsDialog},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      order: Object.assign({}, defaultOrder),
      isEdit: false,
      listLoading: true,
      list: null,
      total: null,
      dialogVisible: false,
      operateType: null,
      multipleSelection: [],
      closeOrder:{
        dialogVisible:false,
        content:null,
        orderIds:[]
      },
      actionOptions: [
        {label:"待确认", value:"-1"},
        {label:"集运国内", value:"0"},
        {label:"直邮国内", value:"1"},
        {label:"退货", value:"2"},
        {label:"快递海外", value:"3"},
        {label:"海外寄存", value:"4"},
        {label:"StockX寄卖", value:"5"},
        {label:"得物寄卖", value:"6"},
        {label:"国内寄存", value:"7"},
      ],
      orderStatusOptions: [
        {
          label: '待定价',
          value: 0
        },
        {
          label: '待付款',
          value: 1
        },
        {
          label: '已付款',
          value: 2
        },
        {
          label: '已完成',
          value: 3
        }
      ],
      operateOptions: [
        {
          label: "批量发货",
          value: 1
        },
        {
          label: "关闭订单",
          value: 2
        },
        {
          label: "删除订单",
          value: 3
        }
      ],
      logisticsDialogVisible:false
    }
  },
  created() {
    this.listQuery.id = this.$route.query.id;
    this.listQuery.deliverySn = this.$route.query.deliverySn;
    this.listQuery.userSn = this.$route.query.userSn;
    this.getList();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    formatAction(actionCode) {
      switch (actionCode) {
        case "0":
          return "集运国内";
        case "1":
          return "直邮国内";
        case "2":
          return "退货";
        case "3":
          return "快递海外";
        case "4":
          return "海外寄存";
        case "5":
          return "StockX寄卖";
        case "6":
          return "得物寄卖";
        case "7":
          return "国内寄存";
        default:
          return "待用户选择";
      }
    }
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    handleCloseOrder(index, row){
      this.closeOrder.dialogVisible=true;
      this.closeOrder.orderIds=[row.id];
    },
    handleViewLogistics(index, row){
      this.logisticsDialogVisible=true;
    },
    handleDeleteOrder(index, row){
      let ids=[];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleBatchOperate(){
      if(this.multipleSelection==null||this.multipleSelection.length<1){
        this.$message({
          message: '请选择要操作的订单',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if(this.operateType===1){
        //批量发货
        let list=[];
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].orderStatus===1){
            list.push(this.covertOrder(this.multipleSelection[i]));
          }
        }
        if(list.length===0){
          this.$message({
            message: '选中订单中没有可以发货的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$router.push({path:'/oms/deliverOrderList',query:{list:list}})
      }else if(this.operateType===2){
        //关闭订单
        this.closeOrder.orderIds=[];
        for(let i=0;i<this.multipleSelection.length;i++){
          this.closeOrder.orderIds.push(this.multipleSelection[i].id);
        }
        this.closeOrder.dialogVisible=true;
      }else if(this.operateType===3){
        //删除订单
        let ids=[];
        for(let i=0;i<this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      }
    },
    handleSizeChange(val){
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val){
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleUpdate(row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.order = Object.assign({},row);
    },
    handlePayment(row) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.order = Object.assign({}, row);
        this.order.orderStatus = 2;
        this.order.paymentTime = Date.now();
        updateOrder(this.order).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.getList();
        });
      });
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          if (this.order.price) {
            this.order.orderStatus = 1;
          }
          updateOrder(this.order).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        } else {
            this.order.createTime = new Date();
            createOrder(this.order).then(response => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
      })
    },
    getList() {
      this.listLoading = true;
      fetchOrderList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.order = Object.assign({}, defaultOrder);
    },
    deleteOrder(ids){
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids",ids);
        deleteOrder(params).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      })
    }
  }
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


