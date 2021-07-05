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
          <el-form-item label="运单号：">
            <el-input v-model="listQuery.deliverySn" class="input-width" placeholder="运单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="识别码：">
            <el-input v-model="listQuery.userSn" class="input-width" placeholder="识别码" clearable></el-input>
          </el-form-item>
          <el-form-item label="物流单号：">
            <el-input v-model="listQuery.note" class="input-width" placeholder="物流单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="SKU：">
            <el-input v-model="listQuery.sku" class="input-width" placeholder="SKU" clearable></el-input>
          </el-form-item>
          <el-form-item label="尺寸：">
            <el-select v-model="item.size" placeholder="全部" clearable style="width: 177px">
              <el-option v-for="item in sizeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地点：">
            <el-select v-model="listQuery.location" placeholder="全部" clearable style="width: 177px">
              <el-option v-for="item in regionOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.itemStatus" placeholder="全部" clearable style="width: 177px">
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              style="width: 177px"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" type="danger" class="btn-add" @click="handleAdd()" style="margin-left: 20px">录入包裹</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="itemTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" min-width="40" align="center"></el-table-column>
        <el-table-column label="运单号" min-width="160" align="center">
          <template slot-scope="scope">{{scope.row.deliverySn}}</template>
        </el-table-column>
        <el-table-column label="识别码" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="showDiscordIdByUserSn(scope.row.userSn)">
              {{scope.row.userSn}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="地点" min-width="50" align="center">
          <template slot-scope="scope">{{scope.row.location}}</template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="140" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="SKU" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.sku}}</template>
        </el-table-column>
        <el-table-column label="尺寸" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.size}}</template>
        </el-table-column>
        <el-table-column label="物流单号" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="最新操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleOrderDetail(scope.row.orders[0])">
              {{ scope.row.orders[0].orderAction | formatAction }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="80" align="center">
          <template slot-scope="scope">{{statusOptions[scope.row.itemStatus].label}}</template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       v-bind:class="{'text-warning': scope.row.orders[0].orderStatus===0,
                       'text-danger': scope.row.orders[0].orderStatus===1,
                       'text-success': scope.row.orders[0].orderStatus===2}"
                       @click="handleOrderDetail(scope.row.orders[0])">
              {{ scope.row.orders[0].orderStatus | formatOrderStatus }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="success"
                       style="margin-left:0;"
                       v-if="showInboundButton(scope.row)"
                       @click="handleFinish(scope.row)">
              入库
            </el-button>
            <el-button size="mini"
                       type="success"
                       style="margin-left:0;"
                       v-if="showNextButton(scope.row)"
                       @click="handleFinish(scope.row)">
              {{scope.row.itemStatus | formatNextButton}}
            </el-button>
            <el-button size="mini"
                       type="info"
                       style="margin-left:0;margin-top:10px;"
                       @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="info"
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
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑包裹':'添加包裹'"
      :visible.sync="dialogVisible"
      width="80%">
      <el-form :inline="true" :model="item"
               ref="itemForm"
               label-width="180px" size="small">
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              包裹信息：
            </span>
          </div>
        </div>
        <el-form-item label="运单号：">
          <el-input v-model="item.deliverySn" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="识别码：">
          <el-input v-model="item.userSn" style="width: 250px"></el-input>
        </el-form-item>
        <el-button type="warning" @click="checkIfPreload()" size="mini" v-if="!this.isEdit&&!this.isFinish">查询预录</el-button>
        <el-form-item label="地点：">
          <el-select v-model="item.location" placeholder="全部" clearable class="input-width" style="width: 250px">
            <el-option v-for="item in regionOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SKU：">
          <el-input v-model="item.sku" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="尺寸：">
          <el-select v-model="item.size" placeholder="全部" clearable class="input-width" style="width: 250px">
            <el-option v-for="item in sizeOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存放位置：">
          <el-input v-model="item.positionInfo" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="物流单号：">
          <el-input v-model="item.note"
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
      :title="'订单详情'"
      :visible.sync="orderDialogVisible"
      width="80%">
      <el-form :inline="true" :model="order"
               ref="orderForm"
               label-width="180px" size="small">
        <el-form-item label="订单操作：">
          <el-input v-model="order.orderAction" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="运单号：">
          <el-input v-model="order.deliverySn" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="识别码：">
          <el-input v-model="order.userSn" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="重量：">
          <el-input v-model="order.weight" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="重量单位：">
          <el-input v-model="order.weightUnit" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="数量：">
          <el-input v-model="order.amount" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="地址：">
          <el-input v-model="order.destination" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="支付状态：">
          <el-select v-model="order.orderStatus" clearable style="width: 250px">
            <el-option v-for="status in statusOptions"
                       :key="status.value"
                       :label="status.label"
                       :value="status.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="order.price" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="物流单号：">
          <el-input v-model="item.note"
                    type="textarea"
                    :rows="1"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="gotoOrderPage(order)" size="small">进入订单</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getAdminByUserSn, getInfo} from "../../../api/login";
  import SingleUpload from '@/components/Upload/singleUpload'
import {
  statusOptions,
  regionOptions,
  weightUnitOptions,
  formatDateTime,
  formatAction,
  defaultItem,
  defaultOrder,
  actionOptions,
  formatOrderStatus, sizeOptions
} from '../../../dto/options';
  import {
    allocOrder,
    createOrder,
    updateOrder,
    fetchItemList,
    fetchItemOrders,
    updateItem,
    updateItemStatus,
    fetchPreciseItemList,
    createItem,
    deleteItem
  } from '../../../api/warehouse';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    deliverySn: null,
    userSn: null,
    location: null,
    note: null,
    createTime: null,
    sku: null,
    size: null,
    itemStatus: null,
    positionInfo: null,
    orders: []
  };
  const defaultAllocGroup = {
    itemId: null,
    orderId: null
  }
  export default {
    name: 'itemList',
    components:{SingleUpload},
    data() {
      return {
        userInfo: null,
        userSn: null,
        listQuery: Object.assign({}, defaultListQuery),
        actionOptions: actionOptions,
        statusOptions: statusOptions,
        regionOptions: regionOptions,
        sizeOptions: sizeOptions,
        weightUnitOptions: weightUnitOptions,
        multipleSelection: [],
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        item: Object.assign({}, defaultItem),
        order: Object.assign({}, defaultOrder),
        allocGroup: Object.assign({}, defaultAllocGroup),
        isEdit: false,
        isFinish: false,
        orderDialogVisible: false,
        operateType: null,
        operateOptions: [
          {
            label: "批量付款",
            value: 1
          },
          {
            label: "批量发货",
            value: 2
          },
          {
            label: "批量关闭",
            value: 3
          },
        ]
      }
    },
    created() {
      this.getList();
      this.getUserInfo();
    },
    filters: {
      formatNextButton(currentStatus) {
        switch (currentStatus) {
          case 13:
            return "发货";
          case 14:
            return "发货";
          case 15:
            return "寄存";
        }
      },
      formatDateTime: formatDateTime,
      formatAction: formatAction,
      formatOrderStatus: formatOrderStatus
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
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.item = Object.assign({}, defaultItem);
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该货物?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteItem(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleFinish(row) {
        this.isEdit = false;
        this.isFinish = true;
        this.dialogVisible = true;
        this.item = Object.assign({},row);
        this.order = this.item.orders[0];
      },
      handleUpdate(row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.item = Object.assign({},row);
        this.order = Object.assign({},row.orders[0]);
      },
      checkIfPreload() {
        if (!this.item.deliverySn || !this.item.userSn) {
          this.$message({
            type: 'error',
            message: '请填写运单号和识别码!'
          });
          return;
        }
        let query = {
          pageNum: 1,
          pageSize: 10,
          deliverySn: this.item.deliverySn,
          userSn: this.item.userSn,
        };
        fetchPreciseItemList(query).then(response => {
          if (response.data.list.length > 0) {
            this.dialogVisible = false;
            this.listQuery.deliverySn = query.deliverySn;
            this.listQuery.userSn = query.userSn;
            this.handleSearchList();
            this.$message({
              type: 'success',
              message: '货物已预录!'
            });
          } else {
            this.$message({
              type: 'warning',
              message: '没有搜索到已预登记的包裹!'
            });
          }
        });
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isFinish) {
            updateItemStatus(this.item, this.order.orderAction).then(() => {
              this.$message({
                message: '发货成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            }).catch(() => {
              this.dialogVisible = false;
              this.getList();
            });
          } else if (this.isEdit) {
            updateItem(this.item).then(() => {
              updateOrder(this.order).then(() => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            })
          } else {
            this.item.createTime = new Date();
            // find if item is preloaded or not
            if (!this.item.deliverySn) {
              this.$message({
                type: 'error',
                message: '请填写运单号!'
              });
              return;
            }
            let query = {
              pageNum: 1,
              pageSize: 10,
              deliverySn: this.item.deliverySn,
              userSn: this.item.userSn,
            };
            fetchPreciseItemList(query).then(response => {
              if (response.data.list.length > 0) {
                this.dialogVisible = false;
                this.listQuery.deliverySn = query.deliverySn;
                this.listQuery.userSn = query.userSn;
                this.handleSearchList();
                this.$message({
                  type: 'success',
                  message: '货物已预录!'
                });
              } else {
                this.item.itemStatus = 0;
                createItem(this.item).then((response) => {
                  this.createOrderWithItem(response);
                })
              }
            });
          }
        })
      },
      handleOrderDetail(order) {
        this.orderDialogVisible = true;
        this.order = order;
      },
      showDiscordIdByUserSn(userSn) {
        getAdminByUserSn(userSn).then((response) => {
          this.$alert('用户Discord ID: ' + response.data.discordId, '提示', {
            confirmButtonText: '确定',
            type: 'info'
          })
        });
      },
      gotoOrderPage(order) {
        this.$router.push({
          path: '/lms/order',
          query: {
            id: order.id,
            deliverySn: order.deliverySn,
            userSn: order.userSn
          }
        })
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
          //批量付款
          for(let i=0;i<this.multipleSelection.length;i++) {
            this.multipleSelection[i].orders[0].orderStatus = 2;
            this.multipleSelection[i].orders[0].paymentTime = Date.now();
            updateOrder(this.multipleSelection[i].orders[0]).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.getList();
            });
          }
        }else if(this.operateType===2){
          //批量发货
          for(let i=0;i<this.multipleSelection.length;i++) {
            this.multipleSelection[i].orders[0].orderStatus = 3;
            updateOrder(this.multipleSelection[i].orders[0]).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.getList();
            });
          }
        }else if(this.operateType===3){
          //批量关闭
          for(let i=0;i<this.multipleSelection.length;i++) {
            this.multipleSelection[i].orders[0].orderStatus = 4;
            updateOrder(this.multipleSelection[i].orders[0]).then(() => {
              this.$message({
                message: '关闭成功！',
                type: 'success'
              });
              this.getList();
            });
          }
        }
      },
      async createOrderWithItem(itemRes) {
        this.order.createTime = new Date();
        this.order.userSn = this.item.userSn;
        this.order.deliverySn = this.item.deliverySn;
        this.order.note = this.item.note;
        this.order.orderStatus = 0;
        if (!this.order.orderAction) {
          this.order.orderAction = -1;
        }
        createOrder(this.order).then((orderRes) => {
          this.allocateOrderToItem(itemRes, orderRes);
        })
      },
      async allocateOrderToItem(itemRes, orderRes) {
        allocOrder(itemRes.data, orderRes.data).then(()=>{
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.dialogVisible = false;
          this.getList();
        });
      },
      async getListOrder(response) {
        for (const item of response.data.list) {
          await fetchItemOrders(item.id).then(response => {
            if (response.data) {
              item.orders = response.data;
            }
          });
        }
        return response;
      },
      getList() {
        this.listLoading = true;
        fetchItemList(this.listQuery).then(response => {
          this.getListOrder(response).then(response => {
            this.listLoading = false;
            this.list = response.data.list;
            this.total = response.data.total;
          })
        });
      },
      getUserInfo() {
        getInfo().then(response => {
          this.userInfo = response.data;
          this.userSn = response.data.userSn;
        });
      },
      showNextButton(row) {
        if (row.orders.length < 1) {
          return false;
        }
        return row.itemStatus === 13 || row.itemStatus === 14 || row.itemStatus === 15;
      },
      showInboundButton(row) {
        if (row.orders.length < 1) {
          return false;
        }
        return row.itemStatus === 10 && (row.orders[0].orderAction === "0" || row.orders[0].orderAction === "6"
          || row.orders[0].orderAction === "7");
      }
    }
  }
</script>
<style>
.tableTitle {
  position: relative;
  margin: 0 auto;
  width: 600px;
  height: 1px;
  background-color: #d4d4d4;
  text-align: center;
  font-size: 16px;
  color: rgba(101, 101, 101, 1);
}
.midText {
  position: absolute;
  left: 50%;
  background-color: #ffffff;
  padding: 0 15px;
  transform: translateX(-50%) translateY(-50%);
}
.optionalDivider {
  margin-bottom: 36px;
  margin-top: 20px;
}
.text-danger {
  color: red;
}
.text-warning {
  color: orange;
}
.text-success {
  color: green;
}
</style>


