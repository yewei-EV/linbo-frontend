<template>
  <div class="app-container">
<!--    <div class="announcement">-->
<!--      <img :src="speaker" style="margin-right: 15px;">-->
<!--      <span class="announcement-content font-medium" @click="showDetails" @mouseover="stop" @mouseout="start" ref="announcement_content">-->
<!--        {{ msg }}-->
<!--      </span>-->
<!--    </div>-->
    <div class="info-layout">
      <div class="address-title">
        <div>
          <label style="color:#164988">仓库地点：</label>
          <el-select @change="switchWarehouseLocation()" v-model="warehouseLocation" placeholder="全部" clearable style="width:177px">
            <el-option v-for="item in regionOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="info-user">识别码： <span style="color:#164988">{{this.userInfo?this.userInfo.userSn:''}}</span></div>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="info-frame">
            <div class="address-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="info-title">First Name：
                    <span v-if="this.address.firstName!==''" class="content-value">{{this.address.firstName}}</span>
                    <span v-else style="color:gray">请自行设置</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="info-title">Last Name：
                    <span v-if="this.address.lastName!==''" class="content-value">{{this.address.lastName}}</span>
                    <span v-else style="color:gray">请自行设置</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="address-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="info-title">地址1： <span class="content-value">{{this.address.address1}}</span></div>
                </el-col>
                <el-col :span="12">
                  <div class="info-title">地址2： <span class="content-value">{{this.address.address2}}</span></div>
                </el-col>
              </el-row>
            </div>
            <div class="address-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="info-title">城市： <span class="content-value">{{this.address.city}}</span></div>
                </el-col>
                <el-col :span="12">
                  <div class="info-title">州： <span class="content-value">{{this.address.state}}</span></div>
                </el-col>
              </el-row>
            </div>
            <div class="address-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="info-title">邮编： <span class="content-value">{{this.address.zip}}</span></div>
                </el-col>
                <el-col :span="12">
                  <div class="info-title">电话： <span class="content-value">{{this.address.tel}}</span></div>
                </el-col>
              </el-row>
            </div>
            <div class="address-content">
              <el-row :gutter="20">
                <el-col :span="12" v-if="this.address.fullZip">
                  <div class="info-title">全邮编： <span class="content-value">{{this.address.fullZip}}</span></div>
                </el-col>
                <el-col :span="12" v-if="this.address.country">
                  <div class="info-title">国家： <span class="content-value">{{this.address.country}}</span></div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-frame">
            <el-row style="font-size:15px;color:white">
              <el-col style="font-weight: bolder;color: red;margin-bottom: 10px">公告：</el-col>
              <el-col style="white-space: pre-wrap;line-height: 2;">{{announcement}}</el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日包裹</div>
            <div class="total-value">{{this.todayInboundItemCount?this.todayInboundItemCount:0}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日发货</div>
            <div class="total-value">{{this.todayOutboundItemCount?this.todayOutboundItemCount:0}}</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">包裹总数</div>
            <div class="total-value">{{this.totalInboundItemCount?this.totalInboundItemCount:0}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="total-frame" style="text-align: center;">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">发货总数</div>
            <div class="total-value">{{this.totalOutboundItemCount?this.totalOutboundItemCount:0}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="button-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div style="text-align: center;">
            <el-button size="large" class="btn-add" type="success" @click="directToItemList()" style="margin-left: 20px">查看包裹列表</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="text-align: center;">
            <el-button size="large" class="btn-add" type="warning" @click="directToUnknownItemList()" style="margin-left: 20px">待认领包裹</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="un-handle-layout">
      <div class="layout-title">包裹信息</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待确认</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="handleSpecificItemList([1])">
                ({{this.currentNeedToConfirmItemCount}})
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待打包</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="handleSpecificItemList([2,12])">
                ({{this.currentNeedToPackageItemCount}})
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">待付款</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="handleSpecificItemList([3,12])">
                ({{this.currentNeedToPayItemCount}})
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">处理中</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="handleSpecificItemList([4,5,6,7,8,9,13,14,15,20])">
                ({{this.currentProcessingItemCount}})
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">已发货</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="handleSpecificItemList([10,16,18])">
                ({{this.currentSentItemCount}})
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="un-handle-item">
              <span class="font-medium">寄存中</span>
              <el-button style="float: right; padding: 0; font-size: 20px"
                         class="color-danger" type="text" @click="handleSpecificItemList([11,17])">
                ({{this.currentStorageItemCount}})
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
    <el-dialog
      :visible.sync="announcementDialogVisible"
      width="80%">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="un-handle-item" style="word-break:break-all">
            <span class="font-title-large">公告： </span>
            <span class="font-medium">{{this.announcement}}</span>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="announcementDialogVisible = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {str2Date} from '@/utils/date';
import img_home_order from '@/assets/images/home_order.png';
import img_home_today_amount from '@/assets/images/home_today_amount.png';
import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
import speaker from '@/assets/images/speaker.png';
import {fetchItemCount} from '@/api/warehouse';
import {getAnnouncement, getInfo} from "../../api/login";
import {
  statusOptions,
} from '../../dto/options';
import {getAddress} from "../../utils/address";

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

const defaultAddress = {
  firstName: null,
  lastName: null,
  address1: null,
  address2: null,
  city: null,
  state: null,
  zip: null,
  tel: null,
  fullZip: null,
  country: null
};
export default {
  name: 'home',
  data() {
    return {
      msg: null,
      announcement: null,
      intervalId: null,
      userInfo: null,
      warehouseLocation: "US2",
      address: Object.assign({}, defaultAddress),
      announcementDialogVisible: false,
      todayInboundItemCount: 0,
      todayOutboundItemCount: 0,
      totalInboundItemCount: 0,
      totalOutboundItemCount: 0,
      currentNeedToConfirmItemCount: 0,
      currentNeedToPackageItemCount: 0,
      currentNeedToPayItemCount: 0,
      currentProcessingItemCount: 0,
      currentSentItemCount: 0,
      currentStorageItemCount: 0,
      regionOptions: [
        // {label:"新泽西", value:'US1'},
        {label:"洛杉矶", value:'US2'},
        {label:"西班牙", value:'SP'},
        {label:"意大利", value:'IT'},
        {label:"荷兰", value:'NL'},
        {label:"德国", value:'DE'},
        // {label:"英国(回国)", value:'EN'},
        {label:"英国(代寄&代卖)", value:'UK'},
        {label:"日本", value:'JP'},
        {label:"澳大利亚", value:'AU'},
        {label:"香港", value:'HK'},
        {label:"加拿大", value:'CA'},
      ],
      itemCountOption: {
        dayOffset: null,
        location: null,
        status: null
      },
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
      speaker,
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount
    }
  },
  created(){
    this.getSalesInfo();
    this.initOrderCountDate();
    this.getData();
    this.getAnnouncement();
    this.start();
  },
  methods:{
    showDetails() {
      this.announcementDialogVisible = true;
    },
    start() {
      let that = this;
      if (that.intervalId != null) {
        return;
      } else {
        that.intervalId = setInterval(() => {
          //截取到头到第一个字符串
          let start = that.msg.substring(0, 1);
          //截取到后面所有到字符串
          let end = that.msg.substring(1);
          //重新拼接得到新到字符串，并赋值给msg
          that.msg = end + start;
        }, 400);
      }
    },
    stop() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },
    directToItemList() {
      this.$router.push({
        path: '/user/item'
      })
    },
    directToUnknownItemList() {
      this.$router.push({
        path: '/user/item',
        query: {
          userSn: "无识别码"
        }
      })
    },
    handleSpecificItemList(itemStatuses) {
      this.$router.push({
        path: '/user/item',
        query: {
          itemStatuses: itemStatuses
        }
      })
    },
    getSalesInfo() {
      getInfo().then(response => {
        this.userInfo = response.data;
        this.fetchStatisticsInfo();
        this.switchWarehouseLocation();
      });
    },
    fetchStatisticsInfo() {
      let inBoundOption = {
        dayOffset: 0,
        userSn: this.userInfo.userSn,
        statuses: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20]
      }
      let outBoundOption = {
        dayOffset: 0,
        userSn: this.userInfo.userSn,
        statuses: [10,12,13,14,15,16,17,18]
      }
      fetchItemCount(inBoundOption).then((response) => {
        this.todayInboundItemCount = response.data;
      });
      fetchItemCount(outBoundOption).then((response) => {
        this.todayOutboundItemCount = response.data;
      });
      let totalInBoundOption = {
        dayOffset: 7,
        userSn: this.userInfo.userSn,
        statuses: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20]
      };
      let totalOutBoundOption = {
        dayOffset: 7,
        userSn: this.userInfo.userSn,
        statuses: [10,12,13,14,15,16,17,18]
      };
      fetchItemCount(totalInBoundOption).then((response) => {
        this.totalInboundItemCount = response.data;
      });
      fetchItemCount(totalOutBoundOption).then((response) => {
        this.totalOutboundItemCount = response.data;
      });

      // user packages statistics info
      let alreadyInboundOption = {
        userSn: this.userInfo.userSn,
        statuses: [1]
      };
      fetchItemCount(alreadyInboundOption).then((response) => {
        this.currentNeedToConfirmItemCount = response.data;
      });
      let currentInboundOption = {
        userSn: this.userInfo.userSn,
        statuses: [2,12]
      };
      fetchItemCount(currentInboundOption).then((response) => {
        this.currentNeedToPackageItemCount = response.data;
      });
      let needToPayOption = {
        userSn: this.userInfo.userSn,
        statuses: [3,12]
      };
      fetchItemCount(needToPayOption).then((response) => {
        this.currentNeedToPayItemCount = response.data;
      });
      let processingOption = {
        userSn: this.userInfo.userSn,
        statuses: [4,5,6,7,8,9,13,14,15,20]
      };
      fetchItemCount(processingOption).then((response) => {
        this.currentProcessingItemCount = response.data;
      });
      let sentOption = {
        userSn: this.userInfo.userSn,
        statuses: [10,16,18]
      };
      fetchItemCount(sentOption).then((response) => {
        this.currentSentItemCount = response.data;
      });
      let storageOption = {
        userSn: this.userInfo.userSn,
        statuses: [11,17]
      };
      fetchItemCount(storageOption).then((response1) => {
        this.currentStorageItemCount = response1.data;
      });

    },
    switchWarehouseLocation() {
      this.address = getAddress(this.warehouseLocation, this.userInfo.userSn, "", "");
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
    },
    getAnnouncement() {
      getAnnouncement().then(response => {
        this.msg = response.data;
        this.announcement = response.data;
      });
    }
  }
}
</script>

<style scoped>
.announcement {
  width: 100%;
  display: inline-flex;
  margin-bottom: 30px;
}
.announcement-content {
  width:  100%;
  overflow: hidden;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.app-container {
  margin-left: 120px;
  margin-right: 120px;
}

.button-layout {
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
.statistics-layout {
  margin-top: 40px;
  border: 1px solid #DCDFE6;
}
.total-layout {
  margin-top: 40px;
}
.info-frame {
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  padding: 15px;
  height: 330px;
  background-color: slateblue;
}
.address-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.info-title {
  color: orange;
  font-size: 15px;
  margin-bottom: 10px;
}
.address-content {
  margin-bottom: 25px;
}
.content-value {
  color: whitesmoke;
}
.info-user {
  margin-top: 10px;
  margin-right: 10px;
  font-size: 18px;
  color: orange;
}
</style>
