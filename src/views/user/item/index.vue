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
      <el-button size="mini" class="btn-add" type="primary" @click="refreshData()" style="margin-left: 20px">刷新</el-button>
      <el-button size="mini" class="btn-add" type="warning" @click="handlePreload()">包裹预录</el-button>
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
        <el-table-column label="包裹操作" min-width="140" align="center">
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
          <template slot-scope="scope">{{scope.row.itemStatus | formatItemStatus}}</template>
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
        <el-table-column label="操作" min-width="120" align="center" v-if="this.listQuery.userSn !== '无识别码'">
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
                       v-if="scope.row.orders && getButtonByAction(scope.row.orders[0].orderAction, scope.row.itemStatus)==='上传Label'
                       && !scope.row.orders[0].attachment"
                       @click="uploadAttachment(scope.$index, scope.row)">
              上传Label
            </el-button>
            <el-button size="mini"
                       type="warning"
                       v-if="scope.row.orders && getButtonByAction(scope.row.orders[0].orderAction, scope.row.itemStatus)==='上传Label'
                       && scope.row.orders[0].attachment"
                       @click="uploadAttachment(scope.$index, scope.row)">
              修改Label
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
        <el-form-item v-if="order.orderAction==='2'" label="SKU：">
          <el-input v-model="item.sku" style="width: 250px" placeholder="SKU" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'" label="Size：">
          <el-input v-model="item.size" style="width: 250px" placeholder="Size" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='1'||order.orderAction==='3'||order.orderAction==='9'" label="地址：">
          <el-select no-data-text="请至地址管理中添加地址" v-model="order.destination" clearable style="width: 600px">
            <el-option v-for="address in addressOptions"
                       :key="address.value"
                       :label="address.label"
                       :value="address.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='3'||order.orderAction==='5'" label="Label：" prop="附件">
          <pdf-upload v-model="order.attachment"></pdf-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderActionDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="chooseActionConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="directDeliveryDialogVisible"
      width="80%">
      <el-form :inline="true" label-width="180px" size="small">
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              直邮包裹数量: {{this.multipleSelection.length===0?1:this.multipleSelection.length}}
            </span>
          </div>
        </div>
        <el-form-item label="地址：">
          <el-select no-data-text="请至地址管理中添加地址" v-model="directDestination" clearable style="width: 600px">
            <el-option v-for="address in addressOptions"
                       :key="address.value"
                       :label="address.label"
                       :value="address.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="directDeliveryDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="directDeliveryConfirm()" size="small">确 定</el-button>
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
          <el-select no-data-text="请至地址管理中添加地址" v-model="order.destination" clearable style="width: 600px">
            <el-option v-for="address in addressOptions"
                       :key="address.value"
                       :label="address.label"
                       :value="address.value">
            </el-option>
          </el-select>
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
        <el-form-item v-if="order.orderAction==='2'" label="SKU：">
          <el-input v-model="item.sku" style="width: 250px" placeholder="SKU" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'" label="Size：">
          <el-input v-model="item.size" style="width: 250px" placeholder="Size" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='1'||order.orderAction==='3'||order.orderAction==='9'" label="地址：">
          <el-select no-data-text="请至地址管理中添加地址" v-model="order.destination" clearable style="width: 600px">
            <el-option v-for="address in addressOptions"
                       :key="address.value"
                       :label="address.label"
                       :value="address.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='3'||order.orderAction==='5'" label="Label：" prop="附件">
          <pdf-upload v-model="order.attachment"></pdf-upload>
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
        <el-col v-if="order.sfPrice" :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">顺丰运费：</span>
            ￥{{order.sfPrice}}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">用户备注：</span>
            {{order.userRemark}}
          </div>
        </el-col>
      </el-row>
      <el-row v-if="order.storageDays" class="el-row-user" :gutter="20">
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
            <span class="font-title-large">Label单号：</span>
            {{order.labelNumber}}
          </div>
        </el-col>
      </el-row>
      <el-row class="el-row-user" :gutter="20">
        <el-col :span="12">
          <div class="un-handle-item">
            <span class="font-title-large">Label：</span>
            <a :href="order.attachment" target="_blank" download>
              <el-button v-if="order.attachment" size="small">下载</el-button>
            </a>
          </div>
        </el-col>
        <el-col :span="12" v-if="order.overtimeDate">
          <div class="un-handle-item">
            <span class="font-title-large">超时时间：</span>
            {{order.overtimeDate | formatDateTime}}
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false" size="small">关 闭</el-button>
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
        <el-form-item v-if="order.orderAction==='2'" label="SKU：">
          <el-input v-model="item.sku" style="width: 250px" placeholder="SKU" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'" label="Size：">
          <el-input v-model="item.size" style="width: 250px" placeholder="Size" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='1'||order.orderAction==='3'||order.orderAction==='9'" label="地址：">
          <el-select no-data-text="请至地址管理中添加地址" v-model="order.destination" clearable style="width: 600px">
            <el-option v-for="address in addressOptions"
                       :key="address.value"
                       :label="address.label"
                       :value="address.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='3'||order.orderAction==='5'" label="Label：" prop="附件">
          <pdf-upload v-model="order.attachment"></pdf-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEndStorageVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleChooseNextActionConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'预录包裹（澳大利亚仓Only）'"
      :visible.sync="preloadDialogVisible"
      width="80%">
      <el-form :inline="true" :model="item"
               ref="itemForm"
               label-width="180px" size="small">
        <el-form-item label="运单号：">
          <el-input v-model="item.deliverySn" style="width: 250px"></el-input>
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
        <el-form-item v-if="order.orderAction==='2'||order.orderAction==='3'||order.orderAction==='5'" label="Label：" prop="附件">
          <pdf-upload v-model="order.attachment"></pdf-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="preloadDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="preloadPackage()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getInfo} from "../../../api/login";
  import PdfUpload from '../../../components/Upload/pdfUpload'
  import {
    orderStatusOptions,
    statusOptions,
    regionOptions,
    weightUnitOptions,
    defaultItem,
    defaultOrder,
    formatDateTime,
    formatAction,
    formatWeightUnit,
    formatOrderStatus,
    formatLocation,
    getActionOptionsByLocation,
    getActionOptionsAfterStorageByLocation, formatItemStatus, sizeOptions,
  } from '../../../dto/options';
  import {
    updateOrderByUser,
    fetchItemList,
    fetchItemOrders, updateItemStatus, refreshItemStatusByOrder, createOrder, createItem,
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
    components:{PdfUpload},
    data() {
      return {
        processButton: '完成',
        userInfo: null,
        listQuery: Object.assign({}, defaultListQuery),
        orderStatusOptions: orderStatusOptions,
        statusOptions: statusOptions,
        sizeOptions: sizeOptions,
        regionOptions: regionOptions,
        weightUnitOptions: weightUnitOptions,
        actionOptions:  [
          {label:"待用户选择", value:"-1"},
          {label:"集运linbo国内仓", value:"0"},
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
        directDeliveryDialogVisible: false,
        totalDeliveryDialogVisible: false,
        secondOrderActionDialogVisible: false,
        orderAttachmentDialogVisible: false,
        preloadDialogVisible: false,
        orderDialogVisible: false,
        operateType: null,
        directDestination: null,
        operateOptions: [
          {
            label: "批量选择直邮",
            value: 1
          },
          {
            label: "批量结束寄存并直邮",
            value: 2
          },
         // {
         //   label: "批量集运linbo国内仓",
         //     value: 3
         // }
        ]
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
      formatItemStatus: formatItemStatus,
      formatDateTime: formatDateTime,
      formatAction: formatAction,
      formatWeightUnit: formatWeightUnit,
      formatOrderStatus: formatOrderStatus,
      formatLocation: formatLocation
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.listQuery.userSn = this.userInfo.userSn;
      },
      // querySearch(queryString, cb) {
      //   let results = queryString ? this.addressOptions.filter(this.createFilter(queryString)) : this.addressOptions;
      //   // 调用 callback 返回建议列表的数据
      //   cb(results);
      // },
      // createFilter(queryString) {
      //   return (addressOptions) => {
      //     return (addressOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      //   };
      // },
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
        this.actionOptions = getActionOptionsByLocation(row.location);
        if (row.location === "AU") {
          this.actionOptions.splice(1, 1);
        }
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
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.order.orderAction === "2"||this.order.orderAction === "3"||this.order.orderAction === "5") {
            if (!this.order.labelNumber || !this.order.attachment) {
              this.$message({
                type: 'error',
                message: 'Label单号/Label附件为必填项!'
              });
              return;
            }
          } else if (this.order.orderAction === "9") {
            if (!this.order.destination) {
              this.$message({
                type: 'error',
                message: '地址为必填项!'
              });
              return;
            }
          }
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
      directDeliveryConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!this.directDestination) {
            this.$message({
              type: 'error',
              message: '收货地址为必填项!'
            });
            return;
          }
          if (this.operateType===1) {
            for (let item of this.multipleSelection) {
              item.orders[0].orderAction = "1";
              item.orders[0].destination = this.directDestination;
              updateItemStatus(item, "1").then(() => {
                updateOrderByUser(item.orders[0]).then(() => {
                  this.$message({
                    message: '选择成功！',
                    type: 'success'
                  });
                  this.directDeliveryDialogVisible = false;
                  this.getList();
                })
              });
            }
          } else if (this.operateType===2) {
            for (let item of this.multipleSelection) {
              item.orders[0].orderAction = "1";
              item.orders[0].destination = this.directDestination;
              item.orders[0].storageDays = Math.ceil((Date.now() - Date.parse(item.createTime)) / (1000 * 3600 * 24));
              item.orders[0].storageLocation = item.itemStatus === 11?item.location:"CN";
              updateOrderByUser(item.orders[0]).then(() => {
                refreshItemStatusByOrder(item.orders[0]).then(() => {
                  this.$message({
                    message: '修改成功！',
                    type: 'success'
                  });
                  this.directDeliveryDialogVisible = false;
                  this.getList();
                });
              });
            }
          }
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
      handlePreload() {
        this.item = Object.assign({}, defaultItem);
        this.item.location = "AU";
        this.item.userSn = this.userInfo.userSn;
        this.order = Object.assign({}, defaultOrder);
        this.actionOptions = getActionOptionsByLocation("AU");
        if (this.item.location === "AU") {
          this.actionOptions.splice(1, 1);
        }
        this.preloadDialogVisible = true;
      },
      handleEndStorage(row) {
        this.item = Object.assign({}, row);
        this.order = this.item.orders[0];
        this.order.orderAction = '-1';
        if (this.item.itemStatus === 11) {
          this.actionOptionsAfterStorage = getActionOptionsAfterStorageByLocation(row.location);
          if (row.location === "AU") {
            this.actionOptionsAfterStorage.splice(1, 1);
          }
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
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.order.orderAction === "2"||this.order.orderAction === "3"||this.order.orderAction === "5") {
            if (!this.order.labelNumber || !this.order.attachment) {
              this.$message({
                type: 'error',
                message: 'Label单号/Label附件为必填项!'
              });
              return;
            }
          }
          if (this.order.orderAction === "9") {
            if (!this.order.destination) {
              this.$message({
                type: 'error',
                message: '收货地址为必填项!'
              });
              return;
            }
          }
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
      preloadPackage() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.item.createTime = new Date();
          // find if item is preloaded or not
          if (!this.item.deliverySn || !this.item.userSn) {
            this.$message({
              type: 'error',
              message: '运单号/识别码/入库地点为必填项!'
            });
            return;
          }
          this.item.itemStatus = 0;
          this.order.createTime = new Date();
          this.order.userSn = this.item.userSn;
          this.order.deliverySn = this.item.deliverySn;
          this.order.location = this.item.location;
          if (!this.order.orderStatus) {
            this.order.orderStatus = 4;
          }
          if (!this.order.orderAction) {
            this.order.orderAction = "-1";
          }
          createOrder(this.order).then((res) => {
            if (res.code === 200) {
              createItem(this.item).then(() => {
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
                this.preloadDialogVisible = false;
                this.order = Object.assign({}, defaultOrder);
                this.item = Object.assign({}, defaultItem);
                this.getList();
              });
            }
          })
        });
      },
      getButtonByAction(currentAction, currentStatus) {
        if (currentAction === "-1" && currentStatus === 12) {
          return "选择操作(国内仓)";
        }
        if (currentAction === "-1" && currentStatus !== 11) {
          return "选择操作";
        }
        switch (currentAction) {
          case "2":
            return "上传Label";
          case "5":
            return "上传Label";
        }
      },
      handleBatchOperate(){
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的包裹',
            type: 'warning',
            duration: 1000
          });
          return;
        } else if((this.operateType===1 || this.operateType===2) && this.multipleSelection.length<3){
          this.$message({
            message: '至少三件包裹才能选择直邮',
            type: 'warning',
            duration: 5000
          });
          return;
        }
        if (this.multipleSelection.map(value => value.orders[0].orderAction).every(value => value === "-1"||value === "4")
          && this.multipleSelection.map(value => value.location).every(value => value === "US1")) {
          if(this.operateType===1 || this.operateType===2) {
            //批量选择操作
            this.directDeliveryDialogVisible = true;
          } else if (this.operateType===3) {
            //批量选择集运
            this.totalDeliveryDialogVisible = true;
          }
        } else {
          this.$message({
            message: '请选择允许直邮的包裹(新泽西仓Only)',
            type: 'error',
            duration: 5000
          });
        }
      },
    },
  }
</script>
<style scoped>
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


