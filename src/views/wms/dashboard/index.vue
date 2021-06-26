<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="20">
        <el-col :span="60">
          <label>仓库地点：</label>
          <el-select v-model="warehouseLocation" placeholder="全部" clearable style="width: 177px">
            <el-option v-for="item in regionOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-button
            style="margin-left: 15px"
            type="primary"
            @click="switchWarehouseLocation()"
            size="large">
            切换
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日入库</div>
            <div class="total-value">{{this.inboundItemCount?this.inboundItemCount:0}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日出库</div>
            <div class="total-value">{{this.outboundItemCount?this.outboundItemCount:0}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">今日销售</div>
            <div class="total-value">￥{{this.todaySales?this.todaySales:0}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">7天销售</div>
            <div class="total-value">￥{{this.sevenDaysSales?this.sevenDaysSales:0}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待集运国内</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="directToSpecificItemList(4)">
                ({{this.totalDeliveryCount}})
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待直邮国内</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="directToSpecificItemList(5)">
                ({{this.directDeliveryCount}})
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待处理退货</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="directToSpecificItemList(6)">
                ({{this.refundCount}})
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待快递海外</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="directToSpecificItemList(7)">
                ({{this.localDeliveryCount}})
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待海外寄存</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="directToSpecificItemList(8)">
                ({{this.localStorageCount}})
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待StockX寄卖</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="directToSpecificItemList(9)">
                ({{this.stockxOrderCount}})
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">10000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">1000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">100000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {str2Date} from '@/utils/date';
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import {
    statusOptions,
    regionOptions,
  } from '../../../dto/options';
  import {fetchItemCount, fetchSalesCount} from "../../../api/warehouse";
  import {getInfo} from "../../../api/login";

  const DATA_FROM_BACKEND = {
    columns: ['date', 'orderCount','orderAmount'],
    rows: [
      {date: '2021-05-01', orderCount: 10, orderAmount: 1093},
      {date: '2021-05-02', orderCount: 20, orderAmount: 2230},
      {date: '2021-05-03', orderCount: 33, orderAmount: 3623},
      {date: '2021-05-04', orderCount: 50, orderAmount: 6423},
      {date: '2021-05-05', orderCount: 80, orderAmount: 8492},
      {date: '2021-05-06', orderCount: 60, orderAmount: 6293},
      {date: '2021-05-07', orderCount: 20, orderAmount: 2293},
      {date: '2021-05-08', orderCount: 60, orderAmount: 6293},
      {date: '2021-05-09', orderCount: 50, orderAmount: 5293},
      {date: '2021-05-10', orderCount: 30, orderAmount: 3293},
      {date: '2021-05-11', orderCount: 20, orderAmount: 2293},
      {date: '2021-05-12', orderCount: 80, orderAmount: 8293},
      {date: '2021-05-13', orderCount: 100, orderAmount: 10293},
      {date: '2021-05-14', orderCount: 10, orderAmount: 1293},
      {date: '2021-05-15', orderCount: 40, orderAmount: 4293}
    ]
  };
  export default {
    name: 'dashboard',
    data() {
      return {
        userInfo: null,
        warehouseLocation: null,
        inboundItemCount: 0,
        outboundItemCount: 0,
        todaySales: 0,
        sevenDaysSales: 0,
        totalDeliveryCount: 0,
        directDeliveryCount: 0,
        refundCount: 0,
        localDeliveryCount: 0,
        localStorageCount: 0,
        stockxOrderCount: 0,
        regionOptions: regionOptions,
        statusOptions: statusOptions,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2021);
              start.setMonth(4);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2021);
              start.setMonth(4);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area: true,
          axisSite: { right: ['orderAmount']},
        labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}},
        chartData: {
          columns: [],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount
      }
    },
    created(){
      this.getSalesInfo();
      this.initOrderCountDate();
      this.getData();
    },
    methods:{
      directToSpecificItemList(itemStatus) {
        this.$router.push({
          path: '/wms/item',
          query: {
            itemStatus: itemStatus,
            location: this.warehouseLocation
          }
        })
      },
      getSalesInfo() {
        getInfo().then(response => {
          this.userInfo = response.data;
          this.warehouseLocation = response.data.region;
          this.fetchStatisticsInfo();
        });
      },
      fetchStatisticsInfo() {
        let inBoundOption = {
          dayOffset: 0,
          location: this.warehouseLocation,
          statusRange: "1,9"
        }
        let outBoundOption = {
          dayOffset: 0,
          location: this.warehouseLocation,
          statusRange: "10,18"
        }
        fetchItemCount(inBoundOption).then((response) => {
          this.inboundItemCount = response.data;
        });
        fetchItemCount(outBoundOption).then((response) => {
          this.outboundItemCount = response.data;
        });

        let saleOption = {
          location: this.warehouseLocation,
          dayOffset: 0
        };
        let saleOption7Days = {
          location: this.warehouseLocation,
          dayOffset: 7
        };
        fetchSalesCount(saleOption).then((response) => {
          this.todaySales = response.data;
        });
        fetchSalesCount(saleOption7Days).then((response) => {
          this.sevenDaysSales = response.data;
        });

        let totalDeliveryOption = {
          location: this.warehouseLocation,
          statusRange: "4"
        };
        fetchItemCount(totalDeliveryOption).then((response) => {
          this.totalDeliveryCount = response.data;
        });
        let directDeliveryOption = {
          location: this.warehouseLocation,
          statusRange: "5"
        };
        fetchItemCount(directDeliveryOption).then((response) => {
          this.directDeliveryCount = response.data;
        });
        let refundOption = {
          location: this.warehouseLocation,
          statusRange: "6"
        };
        fetchItemCount(refundOption).then((response) => {
          this.refundCount = response.data;
        });
        let localDeliveryOption = {
          location: this.warehouseLocation,
          statusRange: "7"
        };
        fetchItemCount(localDeliveryOption).then((response) => {
          this.localDeliveryCount = response.data;
        });
        let localStorageOption = {
          location: this.warehouseLocation,
          statusRange: "8"
        };
        fetchItemCount(localStorageOption).then((response) => {
          this.localStorageCount = response.data;
        });
        let stockxOrderOption = {
          location: this.warehouseLocation,
          statusRange: "9"
        };
        fetchItemCount(stockxOrderOption).then((response) => {
          this.stockxOrderCount = response.data;
        });
      },
      switchWarehouseLocation() {
        this.fetchStatisticsInfo();
      },
      handleDateChange(){
        this.getData();
      },
      initOrderCountDate(){
        let start = new Date();
        start.setFullYear(2021);
        start.setMonth(4);
        start.setDate(1);
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate=[start,end];
      },
      getData(){
        setTimeout(() => {
          this.chartData = {
            columns: ['date', 'orderCount','orderAmount'],
            rows: []
          };
          for(let i=0;i<DATA_FROM_BACKEND.rows.length;i++){
            let item=DATA_FROM_BACKEND.rows[i];
            let currDate=str2Date(item.date);
            let start=this.orderCountDate[0];
            let end=this.orderCountDate[1];
            if(currDate.getTime()>=start.getTime()&&currDate.getTime()<=end.getTime()){
              this.chartData.rows.push(item);
            }
          }
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 40px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 40px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 40px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
