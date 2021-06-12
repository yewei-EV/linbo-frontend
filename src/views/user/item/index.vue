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
            <el-select v-model="listQuery.itemStatus" placeholder="全部" clearable style="width: 177px">
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
    </el-card>
    <div class="table-container">
      <el-table ref="itemTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="运单号" width="160" align="center">
          <template slot-scope="scope">{{scope.row.deliverySn}}</template>
        </el-table-column>
        <el-table-column label="地点" width="50" align="center">
          <template slot-scope="scope">{{scope.row.location}}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="SKU" width="60" align="center">
          <template slot-scope="scope">{{scope.row.sku}}</template>
        </el-table-column>
        <el-table-column label="尺寸" width="60" align="center">
          <template slot-scope="scope">{{scope.row.size}}</template>
        </el-table-column>
        <el-table-column label="最新操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleOrderDetail(scope.row.orders[0])">
              {{ scope.row.orders[0].orderAction | formatAction }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">{{statusOptions[scope.row.itemStatus].label}}</template>
        </el-table-column>orderAction
        <el-table-column label="操作" width="160" align="center" v-if="this.listQuery.userSn">
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
          <el-select v-model="order.orderAction" clearable class="input-width" style="width: 250px">
            <el-option v-for="order in actionOptions"
                       :key="order.value"
                       :label="order.label"
                       :value="order.value">
            </el-option>
          </el-select>
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
            <span class="font-title-large">订单状态：</span>
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
  </div>
</template>
<script>
  import {createItem,updateItem,updateStatus,deleteItem,getRoleByAdmin} from '@/api/login';
  import SingleUpload from '@/components/Upload/singleUpload'
  import {formatDate} from '@/utils/date';
  import {getNextStatus} from '@/utils/statusLogic';
  import {modifyItemStatus} from '@/api/warehouse';
  import {
    fetchItemList,
    fetchPreciseItemList,
    fetchItemOrders,
    getInfo,
    allocOrder,
    createOrder, updateOrder
  } from "../../../api/login";

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    deliverySn: null,
    userSn: null,
    location: null,
    note: null,
    createTime: null,
    itemStatus: null,
    positionInfo: null,
    orders: []
  };
  const defaultItem = {
    id: null,
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
  const defaultOrder = {
    id: null,
    orderAction: null,
    weight: null,
    weightUnit: null,
    deliverySn: null,
    userSn: null,
    destination: null,
    note: null,
    createTime: null,
    orderStatus: null,
    paymentStatus: null,
    paymentTime: null,
    newDeliverySn: null,
    attachment: null
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
        statusOptions: [
          {
            label: '待入库',
            value: 0
          },
          {
            label: '已入库（海外仓）',
            value: 1
          },
          {
            label: '待付款',
            value: 2
          },
          {
            label: '已付款',
            value: 3
          },
          {
            label: '待集运国内',
            value: 4
          },
          {
            label: '待直邮国内',
            value: 5
          },
          {
            label: '待退货',
            value: 6
          },
          {
            label: '待快递海外',
            value: 7
          },
          {
            label: '待海外寄存',
            value: 8
          },
          {
            label: '待StockX寄卖',
            value: 9
          },
          {
            label: '已发货（海外仓）',
            value: 10
          },
          {
            label: '已寄存（海外仓）',
            value: 11
          },
          {
            label: '已入库（国内仓）',
            value: 12
          },
          {
            label: '待得物寄卖',
            value: 13
          },
          {
            label: '待快递国内',
            value: 14
          },
          {
            label: '待国内寄存',
            value: 15
          },
          {
            label: '已发货（国内仓）',
            value: 16
          },
          {
            label: '已寄存（国内仓）',
            value: 17
          },
          {
            label: '已归档',
            value: 18
          },
          {
            label: '待认领',
            value: 19
          }
        ],
        regionOptions: [
          {label:"美国1", value:'US1'},
          {label:"美国2", value:'US2'},
          {label:"西班牙", value:'SP'},
          {label:"欧洲", value:'EU'}
        ],
        weightUnitOptions: [
          {label:"lb", value:'0'},
          {label:"kg", value:'1'}
        ],
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
        warehouseLocation: null,
        multipleSelection: [],
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        item: Object.assign({}, defaultItem),
        order: Object.assign({}, defaultOrder),
        allocGroup: Object.assign({}, defaultAllocGroup),
        isEdit: false,
        orderActionDialogVisible: false,
        orderAttachmentDialogVisible: false,
        orderDialogVisible: false,
        operateType: null,
      }
    },
    created() {
      getInfo().then(response => {
        this.userInfo = response.data;
        this.listQuery.userSn = this.$route.query.userSn;
        this.listQuery.itemStatus = this.$route.query.itemStatus;
        if (!this.listQuery.userSn && !this.listQuery.itemStatus) {
          this.listQuery.userSn = response.data.userSn;
        }
        this.getList();
      });
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
      },
      formatWeightUnit(weightUnit) {
        switch (weightUnit) {
          case 0:
            return "lb";
          case 1:
            return "kg";
        }
      },
      formatOrderStatus(orderStatus) {
        switch (orderStatus) {
          case 0:
            return "待定价";
          case 1:
            return "待付款";
          case 2:
            return "已付款";
          case 3:
            return "已完成";
        }
      }
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
        this.order.id = row.orders[0].id;
      },
      chooseActionByUser(index, row) {
        this.orderActionDialogVisible = true;
        this.order.id = row.orders[0].id;
      },
      handleUpdate(row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.item = Object.assign({},row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.order.orderAction) {
            updateOrder(this.order).then(response => {
              this.$message({
                message: '选择成功！',
                type: 'success'
              });
              this.orderActionDialogVisible = false;
              this.getList();
            })
          } else if (this.order.attachment) {
            updateOrder(this.order).then(response => {
              this.$message({
                message: '上传成功！',
                type: 'success'
              });
              this.orderAttachmentDialogVisible = false;
              this.getList();
            })
          }
          // if (this.isEdit) {
          //   updateItem(this.item).then(() => {
          //     this.$message({
          //       message: '修改成功！',
          //       type: 'success'
          //     });
          //     this.dialogVisible =false;
          //     this.getList();
          //   })
          // } else {
          //   this.item.createTime = new Date();
          //   //find if item is preloaded or not
          //   let query = {
          //     pageNum: 1,
          //     pageSize: 10,
          //     deliverySn: this.item.deliverySn,
          //     userSn: this.item.userSn,
          //     location: this.item.location,
          //   };
          //   fetchPreciseItemList(query).then(response => {
          //     if (response.data.list.length > 0) {
          //       this.dialogVisible = false;
          //       this.listQuery.deliverySn = query.deliverySn;
          //       this.listQuery.userSn = query.userSn;
          //       this.listQuery.location = query.location;
          //       this.handleSearchList();
          //       this.$message({
          //         type: 'success',
          //         message: '货物已预录!'
          //       });
          //     } else {
          //       createItem(this.item).then((response) => {
          //         this.createOrderWithItem(response);
          //       })
          //     }
          //   });
          // }
        })
      },
      handleOrderDetail(order) {
        this.order = order;
        this.orderDialogVisible = true;
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
        this.order.orderStatus = 1;
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
      getRoleListByAdmin(adminId) {
        getRoleByAdmin(adminId).then(response => {
          let allocRoleList = response.data;
          this.allocRoleIds=[];
          if(allocRoleList!=null&&allocRoleList.length>0){
            for(let i=0;i<allocRoleList.length;i++){
              this.allocRoleIds.push(allocRoleList[i].id);
            }
          }
        });
      },
      showNextButton(currentStatus) {
        switch (currentStatus) {
          case 0:
            return true;
          case 4:
            return true;
          case 5:
            return true;
          case 6:
            return true;
          case 7:
            return true;
          case 8:
            return true;
          case 9:
            return true;
          default:
            return false;
        }
      },
      getButtonByAction(currentAction) {
        switch (currentAction) {
          case "-1":
            return "选择操作";
          case "5":
            return "上传回执";
          case "6":
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
</style>


