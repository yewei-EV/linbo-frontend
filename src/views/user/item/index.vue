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
      <div style="margin-top: 40px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="运单号：">
            <el-input v-model="listQuery.deliverySn" class="input-width" placeholder="运单号" clearable></el-input>
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
            <el-select multiple v-model="listQuery.itemStatuses" placeholder="全部" clearable style="width: 177px">
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>包裹列表</span>
      <el-button size="mini" class="btn-add" type="primary" @click="refreshData()">刷新</el-button>
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
        <el-table-column label="地点" min-width="50" align="center">
          <template slot-scope="scope">{{scope.row.location | formatLocation}}</template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="110" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="SKU" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.sku}}</template>
        </el-table-column>
        <el-table-column label="尺寸" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.size}}</template>
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
        <el-table-column label="状态" min-width="100" align="center">
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
        <el-table-column label="入库图片" min-width="100" align="center">
          <template slot-scope="scope">
            <img @click="enlargePhoto(scope.row)" style="height: 50px" :src=scope.row.photo alt="">
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center" v-if="this.listQuery.userSn">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="danger"
                       v-if="getButtonByAction(scope.row.orders[0].orderAction)==='选择操作'"
                       @click="chooseActionByUser(scope.$index, scope.row)">
              选择操作
            </el-button>
            <el-button size="mini"
                       type="warning"
                       v-if="getButtonByAction(scope.row.orders[0].orderAction)==='上传回执'"
                       @click="uploadAttachment(scope.$index, scope.row)">
              上传回执
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container" style="visibility: hidden;">
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
        @click=""
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
      :visible.sync="orderActionDialogVisible"
      width="80%">
      <el-form :inline="true" :model="order"
               ref="orderForm"
               label-width="180px" size="small">
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              选择操作：
            </span>
          </div>
        </div>
        <el-form-item label="操作：">
          <el-select v-model="order.orderAction" clearable style="width: 250px">
            <el-option v-for="order in actionOptions"
                       :key="order.value"
                       :label="order.label"
                       :value="order.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='0'||order.orderAction==='1'||order.orderAction==='3'" label="地址：">
          <el-input v-model="order.destination"
                    type="textarea"
                    :rows="2"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderActionDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="orderAttachmentDialogVisible"
      width="80%">
      <el-form :inline="true" :model="order"
               ref="orderForm"
               label-width="180px" size="small">
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              上传附件：
            </span>
          </div>
        </div>
        <el-form-item label="寄卖平台回执：" prop="附件">
          <single-upload v-model="order.attachment"></single-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderAttachmentDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'订单详情'"
      :visible.sync="orderDialogVisible"
      width="80%">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">订单操作：</span>
            {{order.orderAction | formatAction}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">运单号：</span>
            {{order.deliverySn}}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">重量：</span>
            {{order.weight}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">重量单位：</span>
            {{order.weightUnit | formatWeightUnit}}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">数量：</span>
            {{order.amount}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">地址：</span>
            {{order.destination}}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">支付状态：</span>
            {{order.orderStatus | formatOrderStatus}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">价格：</span>
            ￥{{order.price}}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">附件 ：</span>
            <img style="height: 80px" :src="order.attachment">
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'入库图片'"
      :visible.sync="photoDialogVisible"
      width="50%">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <img style="height: 500px" :src="item.photo">
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="photoDialogVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getInfo,getRoleByAdmin} from "../../../api/login";
  import SingleUpload from '../../../components/Upload/singleUpload'
  import {
    orderStatusOptions,
    statusOptions,
    regionOptions,
    weightUnitOptions,
    defaultItem,
    defaultOrder,
    actionOptions,
    formatDateTime,
    formatAction,
    formatWeightUnit,
    formatOrderStatus, operateOptions, formatLocation,
  } from '../../../dto/options';
  import {
    allocOrder,
    createOrder,
    updateOrderByUser,
    fetchItemList,
    fetchItemOrders, updateItemStatus,
  } from '../../../api/warehouse';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    deliverySn: null,
    userSn: null,
    location: null,
    note: null,
    createTime: null,
    itemStatuses: [],
    positionInfo: null,
    orders: []
  };
  const defaultAllocGroup = {
    itemId: null,
    orderId: null
  };
  export default {
    name: 'itemList',
    components:{SingleUpload},
    data() {
      return {
        processButton: '完成',
        userInfo: null,
        listQuery: Object.assign({}, defaultListQuery),
        orderStatusOptions: orderStatusOptions,
        statusOptions: statusOptions,
        regionOptions: regionOptions,
        weightUnitOptions: weightUnitOptions,
        actionOptions: actionOptions,
        multipleSelection: [],
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        photoDialogVisible: false,
        item: Object.assign({}, defaultItem),
        order: Object.assign({}, defaultOrder),
        allocGroup: Object.assign({}, defaultAllocGroup),
        isEdit: false,
        orderActionDialogVisible: false,
        orderAttachmentDialogVisible: false,
        orderDialogVisible: false,
        operateType: null,
        operateOptions: operateOptions
      }
    },
    created() {
      getInfo().then(response => {
        this.userInfo = response.data;
        this.listQuery.userSn = this.$route.query.userSn;
        if (this.$route.query.itemStatuses) {
          this.listQuery.itemStatuses = this.$route.query.itemStatuses;
        }
        if (!this.listQuery.userSn && (!this.listQuery.itemStatus || !this.listQuery.itemStatuses)) {
          this.listQuery.userSn = response.data.userSn;
        }
        this.getList();
      });
    },
    filters: {
      formatDateTime: formatDateTime,
      formatAction: formatAction,
      formatWeightUnit: formatWeightUnit,
      formatOrderStatus: formatOrderStatus,
      formatLocation: formatLocation
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.userSn = this.userInfo.userSn;
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
      uploadAttachment(index, row) {
        this.orderAttachmentDialogVisible = true;
        this.order = Object.assign({},row.orders[0]);
      },
      chooseActionByUser(index, row) {
        this.orderActionDialogVisible = true;
        this.order = Object.assign({}, row.orders[0]);
        this.order.destination = this.userInfo.address + ',' + this.userInfo.name + ',' + this.userInfo.phoneNumber;
        this.item = Object.assign({}, row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.orderActionDialogVisible) {
            updateItemStatus(this.item, this.order.orderAction).then(() => {
              updateOrderByUser(this.order).then(() => {
                this.$message({
                  message: '选择成功！',
                  type: 'success'
                });
                this.orderActionDialogVisible = false;
                this.getList();
              })
            });
          } else if (this.orderAttachmentDialogVisible) {
            updateOrderByUser(this.order).then(() => {
              this.$message({
                message: '上传成功！',
                type: 'success'
              });
              this.orderAttachmentDialogVisible = false;
              this.getList();
            })
          }
        })
      },
      handleOrderDetail(order) {
        this.order = order;
        this.orderDialogVisible = true;
      },
      enlargePhoto(row) {
        this.item = Object.assign({},row);
        this.photoDialogVisible = true;
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
      async createOrderWithItem(itemRes) {
        this.order.createTime = new Date();
        this.order.userSn = this.item.userSn;
        this.order.deliverySn = this.item.deliverySn;
        this.order.note = this.item.note;
        this.order.orderStatus = 0;
        this.order.orderAction = -1;
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
      refreshData() {
        this.getList();
      },
      getButtonByAction(currentAction) {
        switch (currentAction) {
          case "-1":
            return "选择操作";
          case "2":
            return "上传回执";
          case "5":
            return "上传回执";
        }
      }
    },
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
.un-handle-item {
  border-bottom: 1px solid #EBEEF5;
  padding: 20px 20px 20px 40px;
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


