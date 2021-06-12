<template> 
  <div class="app-container">
    <el-form :inline="true" :model="item"
             ref="itemForm"
             label-width="180px" size="small">
      <el-row :gutter="20" class="preload-field">
        <el-col :span="20">
          <el-form-item label="运单号：">
            <el-input v-model="item.deliverySn" style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="preload-field">
          <el-form-item label="地点：">
            <el-select v-model="item.location" placeholder="全部" clearable class="input-width" style="width: 250px">
              <el-option v-for="item in regionOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="preload-field">
          <el-form-item label="SKU：">
            <el-input v-model="item.sku" style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="preload-field">
          <el-form-item label="尺寸：">
            <el-input v-model="item.size" style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="preload-field">
        </el-col>
      </el-row>
      <div class="optionalDivider">
        <div class="tableTitle">
          <span class="midText">
            选择操作：
          </span>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="20" class="preload-field">
          <el-form-item label="操作：">
            <el-select v-model="order.orderAction" clearable style="width: 250px">
              <el-option v-for="action in actionOptions"
                         :key="action.value"
                         :label="action.label"
                         :value="action.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" class="preload-field">
          <el-form-item v-if="order.orderAction==='0'||order.orderAction==='1'||order.orderAction==='3'" label="地址：">
            <el-input v-model="order.destination"
                      type="textarea"
                      :rows="5"
                      style="width: 250px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="24" style="text-align: center; margin-top: 20px">
          <el-button type="primary" @click="handleDialogConfirm()" size="large" style="width: 80px">添 加</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {createItem,updateItem,updateStatus,deleteItem,getRoleByAdmin} from '@/api/login';
import SingleUpload from '@/components/Upload/singleUpload'
import {formatDate} from '@/utils/date';
import {
  fetchItemList,
  fetchPreciseItemList,
  fetchItemOrders,
  getInfo,
  allocOrder,
  createOrder, updateOrder
} from "../../../api/login";

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
  paymentTime: null,
  attachment: null
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
      actionOptions: [
        // {label:"待确认", value:"-1"},
        {label:"集运国内", value:"0"},
        {label:"直邮国内", value:"1"},
        {label:"退货", value:"2"},
        {label:"快递海外", value:"3"},
        {label:"海外寄存", value:"4"},
        {label:"StockX寄卖", value:"5"},
        {label:"得物寄卖", value:"6"},
        {label:"国内寄存", value:"7"},
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
      multipleSelection: [],
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      item: Object.assign({}, defaultItem),
      order: Object.assign({}, defaultOrder),
      allocGroup: Object.assign({}, defaultAllocGroup),
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
    this.getUserInfo();
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
        this.item.createTime = new Date();
        this.item.userSn = this.userSn;
        this.item.itemStatus = 0;
        createItem(this.item).then((response) => {
          this.createOrderWithItem(response);
        })
      })
    },
    async createOrderWithItem(itemRes) {
      this.order.createTime = new Date();
      this.order.userSn = this.item.userSn;
      this.order.deliverySn = this.item.deliverySn;
      this.order.location = this.item.location;
      this.order.orderStatus = 1;
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
        this.item = Object.assign({}, defaultItem);
        this.order = Object.assign({}, defaultOrder);
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
    getUserInfo() {
      getInfo().then(response => {
        this.userInfo = response.data;
        this.userSn = response.data.userSn;
      });
    },
    checkAllFieldsFilled() {
      return !(!this.item.deliverySn || !this.item.location || !this.item.sku
        || !this.item.size || !this.order.orderAction);
    }
  }
}
</script>
<style>
.app-container {
  margin-top: 40px;
}
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
.preload-field {
  text-align: center;
  margin-top: 20px;
}
</style>


