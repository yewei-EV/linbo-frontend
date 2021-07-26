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
        <el-table-column label="最新操作" min-width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       v-if="scope.row.orders"
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
                       v-if="scope.row.orders"
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
            <el-button size="mini"
                       type="info"
                       v-if="scope.row.photo"
                       style="margin-left:0;margin-top:10px;"
                       @click="enlargePhoto(scope.row)">显示
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" align="center" v-if="this.listQuery.userSn">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="success"
                       style="margin-left:0;"
                       v-if="showEndStorageButton(scope.row)"
                       @click="handleEndStorage(scope.row)">
              结束寄存
            </el-button>
            <el-button size="mini"
                       type="danger"
                       v-if="scope.row.orders && getButtonByAction(scope.row.orders[0].orderAction, scope.row.itemStatus)==='选择操作'"
                       @click="chooseActionByUser(scope.$index, scope.row)">
              选择操作
            </el-button>
            <el-button size="mini"
                       type="danger"
                       v-if="scope.row.orders && getButtonByAction(scope.row.orders[0].orderAction, scope.row.itemStatus)==='选择操作(国内仓)'"
                       @click="chooseSecondActionByUser(scope.$index, scope.row)">
              选择操作
            </el-button>
            <el-button size="mini"
                       type="warning"
                       v-if="scope.row.orders && getButtonByAction(scope.row.orders[0].orderAction, scope.row.itemStatus)==='上传Label'"
                       @click="uploadAttachment(scope.$index, scope.row)">
              上传Label
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
        <el-form-item v-if="order.orderAction==='1'||order.orderAction==='3'||order.orderAction==='9'" label="地址：">
          <el-autocomplete
            v-model="order.destination"
            :fetch-suggestions="querySearch"
            placeholder="请输入地址"
            style="width: 600px">
          </el-autocomplete>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='5'" label="Label：" prop="附件">
          <single-upload v-model="order.attachment"></single-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderActionDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="chooseActionConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="secondOrderActionDialogVisible"
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
            <el-option v-for="order in secondActionOptions"
                       :key="order.value"
                       :label="order.label"
                       :value="order.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='9'" label="地址：">
          <el-autocomplete
            v-model="order.destination"
            :fetch-suggestions="querySearch"
            placeholder="请输入地址"
            style="width: 600px">
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="secondOrderActionDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="chooseActionConfirm()" size="small">确 定</el-button>
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
              上传Label：
            </span>
          </div>
        </div>
        <el-form-item label="Label：" prop="附件">
          <single-upload v-model="order.attachment"></single-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderAttachmentDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="uploadAttachmentConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'订单详情'"
      :visible.sync="orderDialogVisible"
      width="80%">
      <el-row class="el-row-user" :gutter="20">
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
      <el-row class="el-row-user" :gutter="20">
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
      <el-row class="el-row-user" :gutter="20">
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
      <el-row class="el-row-user" :gutter="20">
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
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">寄存天数：</span>
            {{order.storageDays}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">寄存地点：</span>
            {{order.storageLocation | formatLocation}}
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">附件：</span>
            <img style="width: 250px" :src="order.attachment">
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
            <img style="height: 600px" :src="item.photo">
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="photoDialogVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogEndStorageVisible"
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
            <el-option v-for="order in actionOptionsAfterStorage"
                       :key="order.value"
                       :label="order.label"
                       :value="order.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='1'||order.orderAction==='3'||order.orderAction==='9'" label="地址：">
          <el-autocomplete
            v-model="order.destination"
            :fetch-suggestions="querySearch"
            placeholder="请输入地址"
            style="width: 600px">
          </el-autocomplete>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='5'" label="Label：" prop="附件">
          <single-upload v-model="order.attachment"></single-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEndStorageVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleChooseNextActionConfirm()" size="small">确 定</el-button>
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
    fetchItemOrders, updateItemStatus, updateItemStatusByOrder, endStorageByOrder, refreshItemStatusByOrder,
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
        actionOptions:  [
          {label:"待用户选择", value:"-1"},
          {label:"集运linbo国内仓", value:"0"},
          {label:"直邮国内用户手上", value:"1"},
          {label:"退货", value:"2"},
          {label:"转寄海外其他地址", value:"3"},
          {label:"海外寄存", value:"4"},
          {label:"转寄stockx", value:"5"},
          {label:"代卖stockx", value:"8"}
        ],
        secondActionOptions:  [
          {label:"待用户选择", value:"-1"},
          {label:"国内仓代卖", value:"6"},
          {label:"国内仓寄存", value:"7"},
          {label:"顺丰直邮", value:"9"}
        ],
        addressOptions: [],
        actionOptionsAfterStorage: null,
        multipleSelection: [],
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        photoDialogVisible: false,
        dialogEndStorageVisible: false,
        item: Object.assign({}, defaultItem),
        order: Object.assign({}, defaultOrder),
        allocGroup: Object.assign({}, defaultAllocGroup),
        isEdit: false,
        orderActionDialogVisible: false,
        secondOrderActionDialogVisible: false,
        orderAttachmentDialogVisible: false,
        orderDialogVisible: false,
        operateType: null,
        operateOptions: operateOptions
      }
    },
    created() {
      getInfo().then(response => {
        this.userInfo = response.data;
        for (let key of Object.keys(response.data.addressList)) {
          this.addressOptions.push(
            {"value": "收件人: " + response.data.addressList[key].receiverName + ", "
                + "电话: " + response.data.addressList[key].phoneNumber + ", "
                + "地址: " + response.data.addressList[key].address
            }
          );
        }
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
      querySearch(queryString, cb) {
        let results = queryString ? this.addressOptions.filter(this.createFilter(queryString)) : this.addressOptions;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (addressOptions) => {
          return (addressOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
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
        this.item = Object.assign({}, row);
      },
      chooseSecondActionByUser(index, row) {
        this.secondOrderActionDialogVisible = true;
        this.order = Object.assign({}, row.orders[0]);
        this.item = Object.assign({}, row);
      },
      chooseActionConfirm() {
        if (this.order.destination) {
          if (this.order.destination.split(',').length !== 3) {
            this.$message({
              type: 'error',
              duration: 5000,
              message: '地址的格式必须为"收件人: XXX, 电话: XXX, 地址: XXX"'
            });
            return;
          }
        }
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateItemStatus(this.item, this.order.orderAction).then(() => {
            updateOrderByUser(this.order).then(() => {
              this.$message({
                message: '选择成功！',
                type: 'success'
              });
              this.orderActionDialogVisible = false;
              this.secondOrderActionDialogVisible = false;
              this.getList();
            })
          });
        })
      },
      uploadAttachmentConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateOrderByUser(this.order).then(() => {
            this.$message({
              message: '上传成功！',
              type: 'success'
            });
            this.orderAttachmentDialogVisible = false;
            this.getList();
          })
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
      async getListOrder(response) {
        let promiseArray = [];
        for (const item of response.data.list) {
          let promise = fetchItemOrders(item.id).then(response => {
            if (response.data && response.data.length > 0 && response.data[0]) {
              item.orders = response.data;
            } else {
              item.orders = null;
            }
          });
          promiseArray.push(promise)
        }
        await Promise.all(promiseArray);
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
      showEndStorageButton(row) {
        if (!row.orders || row.orders.length < 1) {
          return false;
        }
        return row.itemStatus === 11 || row.itemStatus === 17;
      },
      refreshData() {
        this.getList();
      },
      handleEndStorage(row) {
        this.item = Object.assign({}, row);
        this.order = this.item.orders[0];
        this.order.orderAction = '-1';
        if (this.item.itemStatus === 11) {
          this.actionOptionsAfterStorage = [
            {label:"待用户选择", value:"-1"},
            {label:"集运linbo国内仓", value:"0"},
            {label:"直邮国内用户手上", value:"1"},
            {label:"转寄海外其他地址", value:"3"},
            {label:"转寄stockx", value:"5"},
            {label:"代卖stockx", value:"8"}
          ];
        } else if (this.item.itemStatus === 17) {
          this.actionOptionsAfterStorage = [
            {label:"待用户选择", value:"-1"},
            {label:"国内仓代卖", value:"6"},
            {label:"顺丰直邮", value:"9"}
          ];
        }
        this.dialogEndStorageVisible = true;
      },
      handleChooseNextActionConfirm () {
        if (this.order.destination) {
          if (this.order.destination.split(',').length !== 3) {
            this.$message({
              type: 'error',
              duration: 5000,
              message: '地址的格式必须为"收件人: XXX, 电话: XXX, 地址: XXX"'
            });
            return;
          }
        }
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.order.storageDays = Math.ceil((Date.now() - Date.parse(this.item.createTime)) / (1000 * 3600 * 24));
          this.order.storageLocation = this.item.itemStatus === 11?this.item.location:"CN";
          updateOrderByUser(this.order).then(() => {
            refreshItemStatusByOrder(this.order).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogEndStorageVisible = false;
              this.getList();
            });
          });
        });
      },
      getButtonByAction(currentAction, currentStatus) {
        if (currentAction === "-1" && currentStatus === 12) {
          return "选择操作(国内仓)";
        }
        switch (currentAction) {
          case "-1":
            return "选择操作";
          case "2":
            return "上传Label";
          case "5":
            return "上传Label";
        }
      },
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
.el-row-user {
  border-bottom: 1px solid #EBEEF5;
}
.un-handle-item {
  padding: 20px 20px 20px 20px;
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


