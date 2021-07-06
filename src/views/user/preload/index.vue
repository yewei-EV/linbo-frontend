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
            <el-select v-model="item.size" placeholder="全部" clearable class="input-width" style="width: 250px">
              <el-option v-for="item in sizeOptions"
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
import {getInfo} from "../../../api/login";
import SingleUpload from '@/components/Upload/singleUpload'
import {
  defaultItem,
  defaultOrder,
  statusOptions,
  regionOptions,
  actionOptions,
  weightUnitOptions,
  formatAction,
  formatDateTime, sizeOptions
} from "../../../dto/options";
import {
  allocOrder, createItem,
  createOrder,
  fetchItemOrders
} from '../../../api/warehouse';

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
      defaultItem: defaultItem,
      defaultOrder: defaultOrder,
      statusOptions: statusOptions,
      regionOptions: regionOptions,
      sizeOptions: sizeOptions,
      actionOptions: actionOptions,
      weightUnitOptions: weightUnitOptions,
      multipleSelection: [],
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      item: Object.assign({}, defaultItem),
      order: Object.assign({}, defaultOrder),
      allocGroup: Object.assign({}, defaultAllocGroup),
      orderDialogVisible: false,
      operateType: null
    }
  },
  created() {
    this.getUserInfo();
  },
  filters: {
    formatDateTime: formatDateTime,
    formatAction: formatAction
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
        this.item = Object.assign({}, defaultItem);
        this.order = Object.assign({}, defaultOrder);
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


