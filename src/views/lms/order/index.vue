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
            <el-select v-model="listQuery.orderAction" placeholder="全部" clearable style="width: 177px">
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
          <el-form-item label="地点：">
            <el-select v-model="listQuery.location" placeholder="全部" clearable style="width: 177px">
              <el-option v-for="region in regionOptions"
                         :key="region.value"
                         :label="region.label"
                         :value="region.value">
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
          <el-form-item label="支付状态：">
            <el-select v-model="listQuery.orderStatus" placeholder="全部" clearable style="width: 177px">
              <el-option v-for="item in orderStatusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付时间：">
            <el-date-picker
              style="width: 177px"
              v-model="listQuery.paymentTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="付款备注：">
            <el-input v-model="listQuery.note" class="input-width" placeholder="付款备注" clearable></el-input>
          </el-form-item>
          <el-form-item label="最新更新时间：">
            <el-date-picker
              style="width: 177px"
              v-model="listQuery.updateTime"
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
      <span>订单列表</span>
      <el-button size="mini" class="btn-add" type="primary" @click="refreshData()" style="margin-left: 20px">刷新</el-button>
      <el-button size="mini" type="success" class="btn-add" @click="getExportList()">导出</el-button>
      <!--      <el-button size="mini" type="danger" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加订单</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" min-width="40" align="center"></el-table-column>
        <el-table-column label="ID" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="订单操作" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.orderAction | formatAction}}</template>
        </el-table-column>
        <el-table-column label="地点" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.location | formatLocation}}</template>
        </el-table-column>
        <el-table-column label="价格" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.price?scope.row.price:0}}</template>
        </el-table-column>
        <el-table-column label="重量" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.weight}}</template>
        </el-table-column>
        <el-table-column label="重量单位" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.weightUnit | formatWeightUnit}}</template>
        </el-table-column>
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
        <el-table-column label="创建时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="80" align="center">
          <template slot-scope="scope">
            <span v-bind:class="{'text-warning': scope.row.orderStatus===0,
                       'text-danger': scope.row.orderStatus===1,
                       'text-success': scope.row.orderStatus===2}">
            {{orderStatusOptions[scope.row.orderStatus].label}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="danger"
                       v-if="scope.row.orderAction==='-1'"
                       @click="chooseActionByUser(scope.$index, scope.row)">
              选择操作
            </el-button>
            <el-button size="mini"
                       type="danger"
                       v-if="scope.row.orderStatus===1 && scope.row.price"
                       @click="handlePayment(scope.row)">已付
            </el-button>
            <el-button size="mini"
                       type="primary"
                       style="margin-left:0;margin-top:10px;"
                       @click="handleUpdate(scope.row)">编辑
            </el-button>
<!--            <el-button size="mini"-->
<!--                       type="primary"-->
<!--                       style="margin-left:0;margin-top:10px;"-->
<!--                       @click="handleDelete(scope.$index, scope.row)">删除-->
<!--            </el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="相关包裹" min-width="80" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="info"
                       style="margin-left:0;margin-top:10px;"
                       @click="showRelatedItems(scope.row.id)">显示
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="地址" min-width="80" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="info"
                       v-if="scope.row.destination"
                       style="margin-left:0;margin-top:10px;"
                       @click="showAddressDetails(scope.row.destination)">显示
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="代卖信息" min-width="80" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="info"
                       style="margin-left:0;margin-top:10px;"
                       v-if="scope.row.soldPrice"
                       @click="showDuInfoDialog(scope.row)">显示
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否跟价" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.isFollowPrice?"是":"否"}}</template>
        </el-table-column>
        <el-table-column label="顺丰运费" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.sfPrice?scope.row.sfPrice:0}}</template>
        </el-table-column>
        <el-table-column label="Label单号" min-width="120" align="center">
          <template slot-scope="scope">{{scope.row.labelNumber}}</template>
        </el-table-column>
        <el-table-column label="用户备注" min-width="120" align="center">
          <template slot-scope="scope">{{scope.row.userRemark}}</template>
        </el-table-column>
        <el-table-column label="付款备注" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="支付时间" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.paymentTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="超时时间" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.overtimeDate | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="最新更新时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.updateTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="寄存地点" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.storageLocation | formatLocation}}</template>
        </el-table-column>
        <el-table-column label="寄存天数" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.storageDays?scope.row.storageDays:0}}</template>
        </el-table-column>
        <el-table-column label="寄存开始时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.storageStartTime | formatDateTime}}</template>
        </el-table-column>
      </el-table>
      <el-table id="exportTable"
                :data="exportData" border
                style="display: none">
        <el-table-column label="id" min-width="160" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="订单操作" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.orderAction | formatAction}}</template>
        </el-table-column>
        <el-table-column label="地点" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.location | formatLocation}}</template>
        </el-table-column>
        <el-table-column label="重量" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.weight}}</template>
        </el-table-column>
        <el-table-column label="重量单位" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.weightUnit | formatWeightUnit}}</template>
        </el-table-column>
        <el-table-column label="价格" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.price?scope.row.price:0}}</template>
        </el-table-column>
        <el-table-column label="顺丰运费" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.sfPrice?scope.row.sfPrice:0}}</template>
        </el-table-column>
        <el-table-column label="运单号" min-width="160" align="center">
          <template slot-scope="scope">{{scope.row.deliverySn}}</template>
        </el-table-column>
        <el-table-column label="识别码" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.userSn}}</template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="80" align="center">
          <template slot-scope="scope">{{orderStatusOptions[scope.row.orderStatus].label}}</template>
        </el-table-column>
        <el-table-column label="收件地址" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.destination}}</template>
        </el-table-column>
        <el-table-column label="付款备注" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="支付成功时间" min-width="120" align="center">
          <template slot-scope="scope">{{scope.row.paymentTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="最新更新时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.updateTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="国内尺码" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.chinaSize}}</template>
        </el-table-column>
        <el-table-column label="代卖上线时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.onlineDate | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="卖出时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.soldDate | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="商品价格" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.soldPrice?scope.row.soldPrice:0}}</template>
        </el-table-column>
        <el-table-column label="技术服务费率" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.techServiceFeePercentage?scope.row.techServiceFeePercentage:0}}</template>
        </el-table-column>
        <el-table-column label="技术服务费" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.techServiceFee?scope.row.techServiceFee:0}}</template>
        </el-table-column>
        <el-table-column label="转账手续费" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.transactionFee?scope.row.transactionFee:0}}</template>
        </el-table-column>
        <el-table-column label="查鉴包" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.duServiceFee?scope.row.duServiceFee:0}}</template>
        </el-table-column>
        <el-table-column label="售后无忧" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.afterSaleServiceFee?scope.row.afterSaleServiceFee:0}}</template>
        </el-table-column>
        <el-table-column label="运费+手续费" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.totalServiceFee?scope.row.totalServiceFee:0}}</template>
        </el-table-column>
        <el-table-column label="用户到手价格" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.userOwnPrice?scope.row.userOwnPrice:0}}</template>
        </el-table-column>
        <el-table-column label="实际入账价格" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.realSalePrice?scope.row.realSalePrice:0}}</template>
        </el-table-column>
        <el-table-column label="实际技术服务费" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.realTechServiceFee?scope.row.realTechServiceFee:0}}</template>
        </el-table-column>
        <el-table-column label="实际利润" min-width="80" align="center">
          <template slot-scope="scope">￥{{scope.row.realProfit?scope.row.realProfit:0}}</template>
        </el-table-column>
        <el-table-column label="结算时间" min-width="80" align="center">
          <template slot-scope="scope">{{scope.row.clearDate | formatDateTime}}</template>
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
        <el-form-item label="重量：">
          <el-input v-model="order.weight" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="重量单位：">
          <el-select v-model="order.weightUnit" clearable style="width: 250px">
            <el-option v-for="unit in weightUnitOptions"
                       :key="unit.value"
                       :label="unit.label"
                       :value="unit.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量：">
          <el-input v-model="order.amount" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="地址：">
          <el-input v-model="order.destination" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="支付状态：">
          <el-select v-model="order.orderStatus" clearable style="width: 250px">
            <el-option v-for="status in orderStatusOptions"
                       :key="status.value"
                       :label="status.label"
                       :value="status.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="order.price" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="顺丰运费：">
          <el-input v-model="order.sfPrice" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="付款备注：">
          <el-input v-model="order.note"
                    type="textarea"
                    :rows="1"
                    style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="Label单号：">
          <el-input v-model="order.labelNumber" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="用户备注：">
          <el-input v-model="order.userRemark" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="寄存天数：">
          <el-input v-model="order.storageDays" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="寄存地点：">
          <el-select v-model="order.storageLocation" clearable style="width: 250px">
            <el-option v-for="unit in regionOptions"
                       :key="unit.value"
                       :label="unit.label"
                       :value="unit.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="超时时间：">
          <el-date-picker
            style="width: 250px"
            v-model="order.overtimeDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Label：" prop="附件">
          <pdf-upload v-model="order.attachment"></pdf-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'付款详情'"
      :visible.sync="paymentDialogVisible"
      width="80%">
      <el-form :inline="true" label-width="180px" size="small">
        <el-form-item label="付款备注：">
          <el-input v-model="paymentNote"
                    type="textarea"
                    :rows="1"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paymentDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="processPayment()" size="small">确 定</el-button>
      </span>
    </el-dialog>
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
        <el-form-item v-if="order.orderAction==='5'" label="超时时间：">
          <el-date-picker
            style="width: 250px"
            v-model="order.overtimeDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='3'||order.orderAction==='5'" label="Label单号：">
          <el-input v-model="order.labelNumber" style="width: 250px" placeholder="Label单号" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='3'||order.orderAction==='5'" label="用户备注：">
          <el-input v-model="order.userRemark" style="width: 250px" placeholder="用户备注" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='1'||order.orderAction==='3'||order.orderAction==='9'" label="地址：">
          <el-input v-model="order.destination" style="width: 250px" placeholder="地址" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='3'||order.orderAction==='5'" label="Label：" prop="附件">
          <pdf-upload v-model="order.attachment"></pdf-upload>
        </el-form-item>
        <div style="margin-left: 120px;" v-if="order.orderAction==='6'">
          <span>是否跟价</span>
          <el-switch label="Label：" on-value=true off-value=false v-model="order.isFollowPrice"></el-switch>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderActionDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleActionDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addressDetailsDialogVisible"
      width="80%">
      <el-row class="el-row-address" :gutter="20">
        <el-col :span="24">
          <div class="un-handle-item" style="word-break:break-all">
            <span class="font-title-large">收件地址：</span>
            {{this.address}}
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDetailsDialogVisible = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="relatedItemsDialogVisible"
      width="80%">
      <ul id="v-for-object">
        <li v-for="item in relatedItems">
          <div class="un-handle-item" style="word-break:break-all">
            运单号：{{item.deliverySn}}；
            地点：{{item.location|formatLocation}}；
            包裹状态：{{item.itemStatus|formatItemStatus}}；
            存放位置：{{item.positionInfo}}；
            物流单号：{{item.newDeliverySn}}；
            包裹备注：{{item.remark}}；
            SKU：{{item.sku}}；
            尺寸：{{item.size}}；
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relatedItemsDialogVisible = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'得物代卖信息'"
      :visible.sync="duInfoDialogVisible"
      width="80%">
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">商品价格：</span>
            ￥{{order.soldPrice}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">技术服务费率：</span>
            {{order.techServiceFeePercentage}}
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">技术服务费：</span>
            ￥{{order.techServiceFee}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">转账手续费：</span>
            ￥{{order.transactionFee}}
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">查鉴包：</span>
            ￥{{order.duServiceFee}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">售后无忧：</span>
            ￥{{order.afterSaleServiceFee}}
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">运费+手续费：</span>
            ￥{{order.totalServiceFee}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">用户到手价格：</span>
            ￥{{order.userOwnPrice}}
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">实际入账价格：</span>
            ￥{{order.realSalePrice}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">实际技术服务费：</span>
            ￥{{order.realTechServiceFee}}
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">实际利润：</span>
            ￥{{order.realProfit}}
          </div>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <div class="un-handle-item">-->
<!--          </div>-->
<!--        </el-col>-->
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="duInfoDialogVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import {
  fetchOrderList,
  updateOrder,
  createOrder,
  deleteOrder,
  updateItemStatusByOrder,
  updateOrderByUser,
  refreshItemStatusByOrder,
  fetchItemOrders,
  fetchRelatedItems,
  fetchItemList,
} from '../../../api/warehouse';
import {
  orderStatusOptions,
  weightUnitOptions,
  formatDateTime,
  formatAction,
  defaultOrder, actionOptions, formatWeightUnit, formatLocation, regionOptions, formatItemStatus
} from '../../../dto/options';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {getAdminByUserSn} from "../../../api/login";
import PdfUpload from "../../../components/Upload/pdfUpload";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  id: null,
  orderAction: null,
  deliverySn: null,
  userSn: null,
  destination: null,
  location: null,
  note: null,
  createTime: null,
  orderStatus: null,
  paymentTime: null,
  updateTime: null,
};
export default {
  name: "orderList",
  components:{PdfUpload},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      order: Object.assign({}, defaultOrder),
      currentOrderAction: null,
      isEdit: false,
      listLoading: true,
      list: null,
      total: null,
      address: null,
      relatedItems: [],
      dialogVisible: false,
      paymentDialogVisible: false,
      orderActionDialogVisible: false,
      duInfoDialogVisible: false,
      addressDetailsDialogVisible: false,
      relatedItemsDialogVisible: false,
      operateType: null,
      multipleSelection: [],
      paymentNote: null,
      actionOptions: actionOptions,
      weightUnitOptions: weightUnitOptions,
      orderStatusOptions: orderStatusOptions,
      regionOptions: regionOptions,
      exportData: [],
      operateOptions: []
    }
  },
  created() {
    this.listQuery.orderStatus = this.$route.query.orderStatus;
    this.listQuery.id = this.$route.query.id;
    this.listQuery.deliverySn = this.$route.query.deliverySn;
    this.listQuery.userSn = this.$route.query.userSn;
    this.getList();
  },
  filters: {
    formatDateTime: formatDateTime,
    formatAction: formatAction,
    formatWeightUnit: formatWeightUnit,
    formatLocation: formatLocation,
    formatItemStatus: formatItemStatus
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      if (this.listQuery.deliverySn) {
          this.listQuery.deliverySn = this.listQuery.deliverySn.trim();
        }
      this.getList();
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    handleDeleteOrder(index, row){
      let ids=[];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleBatchOperate(){
      if(this.multipleSelection==null||this.multipleSelection.length<1){
        this.$message({
          message: '请选择要操作的包裹',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if(this.operateType===3){
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
      this.currentOrderAction = this.order.orderAction;
    },
    handlePayment(row) {
      this.paymentNote = row.note;
      this.order = Object.assign({}, row);
      this.paymentDialogVisible = true;
    },
    chooseActionByUser(index, row) {
      this.actionOptions = actionOptions;
      this.orderActionDialogVisible = true;
      this.order = Object.assign({}, row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          if (this.order.price && this.order.orderStatus !== 2) {
            this.order.orderStatus = 1;
          }
          updateOrder(this.order).then(() => {
            if (this.order.orderAction !== this.currentOrderAction) {
              refreshItemStatusByOrder(this.order).then(() => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              });
            } else {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getList();
            }
          })
        } else {
            this.order.createTime = new Date();
            this.order.orderStatus = 4;
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
    },
    processPayment() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.order.note = this.paymentNote;
        if (this.order.sfPrice) {
          this.order.orderStatus = 3;
        } else {
          this.order.orderStatus = 2;
        }
        this.order.paymentTime = Date.now();
        updateOrder(this.order).then(() => {
          refreshItemStatusByOrder(this.order).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.paymentDialogVisible = false;
            this.getList();
          })
        });
      });
    },
    handleActionDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateOrderByUser(this.order).then(() => {
          updateItemStatusByOrder(this.order).then(() => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.orderActionDialogVisible = false;
            this.getList();
          });
        });
      });
    },
    showAddressDetails(value) {
      this.address = value;
      this.addressDetailsDialogVisible = true;
    },
    showDuInfoDialog(row) {
      this.order = Object.assign({},row);
      this.duInfoDialogVisible = true;
    },
    showRelatedItems(orderId) {
      fetchRelatedItems(orderId).then(result => {
        this.relatedItems = result.data;
        this.relatedItemsDialogVisible = true;
      })
    },
    refreshData() {
      this.getList();
    },
    exportExcelData(excelName) {
      try {
        /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'), { raw: true })
        /* get binary string as output */
        let wbout = XLSX.write(wb, { bookType: 'csv', bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), excelName + '.csv')
        } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
        return wbout
      } catch (e) {
        if (typeof console !== 'undefined') console.error(e);
      }
    },
    showDiscordIdByUserSn(userSn) {
      getAdminByUserSn(userSn).then((response) => {
        if (response.data) {
          this.$alert('用户Discord ID: ' + response.data.discordId, '提示', {
            confirmButtonText: '确定',
            type: 'info'
          })
        } else {
          this.$message({
            message: '没有找到对应识别码的用户!',
            type: 'error',
            duration:1000
          });
        }
      });
    },
    async fetchExportItems(listQuery) {
      let orderResponse = await fetchOrderList(listQuery);
      this.exportData = this.exportData.concat(orderResponse.data.list);
      return orderResponse;
    },
    async getExportList() {
      this.listLoading = true;
      this.listQuery.pageSize = 500;
      let i = 1;
      // set max pageNumber to 10
      while (i < 10) {
        this.listQuery.pageNum = i;
        await this.fetchExportItems(this.listQuery).then();
        if (this.exportData.length % 500 !== 0) {
          break;
        }
        i++;
      }
      await this.exportExcelData('orders');
      this.listLoading = false;
    },
  }
}
</script>
<style scoped>
.input-width {
  width: 177px;
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
.un-handle-item {
  padding: 20px 20px 20px 20px;
}
.el-row-address {
  border-bottom: 1px solid #EBEEF5;
}
</style>


