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
          style="float:right;margin-right:15px"
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
          <el-form-item v-if="!this.warehouseLocation" label="地点：">
            <el-select v-model="listQuery.location" placeholder="全部" clearable style="width: 177px">
              <el-option v-for="item in regionOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="存放位置: ">
            <el-input v-model="listQuery.positionInfo" class="input-width" placeholder="存放位置" clearable></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="listQuery.remark" class="input-width" placeholder="备注" clearable></el-input>
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
          <el-form-item label="状态：">
            <el-select multiple collapse-tags v-model="listQuery.itemStatuses" placeholder="全部" clearable style="width: 220px">
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
      <el-button size="mini" class="btn-add" type="primary" style="margin-left: 20px" @click="refreshData()">刷新</el-button>
      <el-button size="mini" class="btn-add" type="danger" style="margin-left: 20px" @click="handleAdd()">包裹入库</el-button>
      <el-button size="mini" type="success" class="btn-add" @click="getExportList()">导出</el-button>
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
        <el-table-column label="地点" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.location | formatLocation}}</template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="140" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="存放位置" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.positionInfo}}</template>
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
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="success"
                       style="margin-left:0;"
                       v-if="showEndStorageButton(scope.row)"
                       @click="handleEndStorage(scope.row)">
              结束寄存
            </el-button>
            <el-button size="mini"
                       type="success"
                       style="margin-left:0;"
                       v-if="showNextButton(scope.row.itemStatus)"
                       @click="handleFinish(scope.row)">
              {{scope.row.itemStatus | formatNextButton}}
            </el-button>
            <el-button size="mini"
                       type="success"
                       v-if="showPackageButton(scope.row.itemStatus)"
                       @click="handlePackage(scope.row)">
              打包
            </el-button>
            <el-button size="mini"
                       type="info"
                       style="margin-left:0;margin-top:10px;"
                       @click="handleUpdate(scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="info"
                       style="margin-left:0;margin-top:10px;"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="地址" min-width="150" align="center">
          <template slot-scope="scope">{{scope.row.orders?scope.row.orders[0].destination:""}}</template>
        </el-table-column>
        <el-table-column label="物流单号" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="备注" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
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
      </el-table>
      <el-table id="exportTable"
                :data="exportData" border
                style="display: none">
        <el-table-column label="id" min-width="160" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="运单号" min-width="160" align="center">
          <template slot-scope="scope">{{scope.row.deliverySn}}</template>
        </el-table-column>
        <el-table-column label="识别码" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.userSn}}</template>
        </el-table-column>
        <el-table-column label="地点" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.location | formatLocation}}</template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="140" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="存放位置" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.positionInfo}}</template>
        </el-table-column>
        <el-table-column label="SKU" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.sku}}</template>
        </el-table-column>
        <el-table-column label="尺寸" min-width="60" align="center">
          <template slot-scope="scope">{{scope.row.size}}</template>
        </el-table-column>
        <el-table-column label="包裹操作" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.orders?scope.row.orders[0].orderAction:"" | formatAction}}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.itemStatus | formatItemStatus}}</template>
        </el-table-column>
        <el-table-column label="支付状态" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.orders?scope.row.orders[0].orderStatus:"" | formatOrderStatus}}</template>
        </el-table-column>
        <el-table-column label="物流单号" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
        <el-table-column label="订单ID" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.orders?scope.row.orders[0].id:""}}</template>
        </el-table-column>
        <el-table-column label="地址" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.orders?scope.row.orders[0].destination:""}}</template>
        </el-table-column>
        <el-table-column label="备注" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
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
      :title="isEdit||isFinish?'编辑包裹':'添加包裹'"
      :visible.sync="dialogVisible"
      width="80%">
      <el-form :inline="true" :model="item"
               ref="itemForm"
               label-width="180px" size="small">
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              包裹信息({{item.location | formatLocation}})：
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
        <el-form-item v-if="!this.warehouseLocation" label="地点：">
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
        <el-form-item label="备注：">
          <el-input v-model="item.remark" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="入库图片：" prop="图片">
          <single-upload v-model="item.photo"></single-upload>
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
          <el-select v-model="order.orderAction" clearable style="width: 250px">
            <el-option v-for="status in actionOptions"
                       :key="status.value"
                       :label="status.label"
                       :value="status.value">
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
            <el-option v-for="status in weightUnitOptions"
                       :key="status.value"
                       :label="status.label"
                       :value="status.value">
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
        <el-form-item label="物流单号：">
          <el-input v-model="item.note"
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
        <el-form-item label="Label：">
          <a :href="order.attachment" target="_blank" download>
            <el-button v-if="order.attachment" size="small">下载</el-button>
          </a>
        </el-form-item>
        <el-form-item v-if="order.overtimeDate" label="超时时间：">
          {{order.overtimeDate | formatDateTime}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false" size="small">取 消</el-button>
        <el-button v-if="!this.warehouseLocation" type="primary" @click="gotoOrderPage(order)" size="small">进入订单</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'批量入库/出库'"
      :visible.sync="inOutBoundDialogVisible"
      width="80%">
      <el-form :inline="true" label-width="180px" size="small">
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              包裹数量: {{this.multipleSelection.length===0?1:this.multipleSelection.length}}
            </span>
          </div>
        </div>
        <el-form-item label="存放位置：">
          <el-input v-model="packagePositionInfo" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item v-if="this.operateType===3" label="物流单号：">
          <el-input v-model="packageNote"
                    type="textarea"
                    :rows="1"
                    style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inOutBoundDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="inOutBoundPackages()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'打包详情'"
      :visible.sync="packageDialogVisible"
      width="80%">
      <el-form :inline="true" label-width="180px" size="small">
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              包裹数量: {{this.multipleSelection.length===0?1:this.multipleSelection.length}}
            </span>
          </div>
        </div>
        <el-form-item label="存放位置：">
          <el-input v-model="packagePositionInfo" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="物流单号：">
          <el-input v-model="packageNote"
                    type="textarea"
                    :rows="1"
                    style="width: 250px"></el-input>
        </el-form-item>
        <div class="optionalDivider">
          <div class="tableTitle">
            <span class="midText">
              称重信息：
            </span>
          </div>
        </div>
        <el-form-item label="重量单位：">
          <el-select v-model="packageWeightUnit" clearable style="width: 250px">
            <el-option v-for="item in weightUnitOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重量：">
          <el-input v-model="packageWeight" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="packagePrice" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="packageDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="tryCombinePackages()" size="small">确 定</el-button>
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
          <el-input v-model="order.destination"
                    type="textarea"
                    :rows="2"
                    style="width: 250px"></el-input>
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
import {
  createItem,
  deleteItem,
  allocOrder,
  updateItem,
  createOrder,
  updateOrder,
  updateItemStatus,
  fetchItemList,
  fetchItemOrders, updateOrderByUser, updateItemStatusByOrder, checkIfItemExist
} from '../../../api/warehouse';
  import SingleUpload from '../../../components/Upload/singleUpload'
  import {
    getAdminByUserSn,
    getInfo
  } from "../../../api/login";
import {
  orderStatusOptions,
  statusOptions,
  regionOptions,
  weightUnitOptions,
  operateOptions,
  defaultItem,
  defaultOrder,
  formatDateTime,
  formatAction,
  formatOrderStatus,
  sizeOptions,
  formatLocation,
  actionOptions,
  getActionOptionsAfterStorageByLocation,
  formatItemStatus
} from '../../../dto/options';
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    deliverySn: null,
    userSn: null,
    location: null,
    note: null,
    createTime: null,
    requestBy: null,
    itemStatuses: [],
    positionInfo: null,
    remark: null,
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
        warehouseLocation: null,
        multipleSelection: [],
        list: null,
        total: null,
        actionOptionsAfterStorage: null,
        listLoading: false,
        dialogVisible: false,
        dialogEndStorageVisible: false,
        item: Object.assign({}, defaultItem),
        order: Object.assign({}, defaultOrder),
        packageWeight: null,
        packagePrice: null,
        packageWeightUnit: null,
        packagePositionInfo: null,
        packageNote: null,
        packageItem: null,
        allocGroup: Object.assign({}, defaultAllocGroup),
        isEdit: false,
        isFinish: false,
        isInput: false,
        orderDialogVisible: false,
        packageDialogVisible: false,
        photoDialogVisible: false,
        inOutBoundDialogVisible: false,
        operateType: null,
        orderStatusOptions: orderStatusOptions,
        statusOptions: [
          {
            label: '已入库（海外仓）',
            value: 1
          }, {
            label: '待打包',
            value: 2
          }, {
            label: '已打包',
            value: 3
          }, {
            label: '待集运linbo国内仓',
            value: 4
          }, {
            label: '待直邮国内用户手上',
            value: 5
          }, {
            label: '待退货',
            value: 6
          }, {
            label: '待转寄海外其他地址',
            value: 7
          }, {
            label: '待海外寄存',
            value: 8
          }, {
            label: '待转寄stockx',
            value: 9
          }, {
            label: '待代卖stockx',
            value: 20
          }, {
            label: '已发货（海外仓）',
            value: 10
          }, {
            label: '已寄存（海外仓）',
            value: 11
          }
        ],
        regionOptions: regionOptions,
        sizeOptions: sizeOptions,
        weightUnitOptions: weightUnitOptions,
        operateOptions: operateOptions,
        actionOptions: actionOptions,
        exportData: null
      }
    },
    created() {
      if (this.$route.query.itemStatus) {
        this.listQuery.itemStatuses = this.$route.query.itemStatus;
      }
      this.listQuery.requestBy = "OS";
      this.listQuery.location = this.$route.query.location;
      getInfo().then(response => {
        this.userInfo = response.data;
        this.warehouseLocation = response.data.region;
        if (!this.listQuery.location) {
          this.listQuery.location = this.warehouseLocation;
        }
        this.getList();
      });
    },
    filters: {
      formatNextButton(currentStatus) {
        switch (currentStatus) {
          case 0:
            return "入库";
          case 4:
            return "发货";
          case 5:
            return "发货";
          case 6:
            return "发货";
          case 7:
            return "发货";
          case 8:
            return "寄存";
          case 9:
            return "发货";
          case 20:
            return "发货";
          default:
            return "待定";
        }
      },
      formatItemStatus: formatItemStatus,
      formatDateTime: formatDateTime,
      formatAction: formatAction,
      formatOrderStatus: formatOrderStatus,
      formatLocation: formatLocation
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.listQuery.itemStatuses = [0,1,2,3,4,5,6,7,8,9,10,11,20];
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
        this.item = Object.assign({}, defaultItem);
        this.item.location = this.warehouseLocation;
        this.order = Object.assign({}, defaultOrder);
        this.isEdit = false;
        this.isFinish = false;
        this.dialogVisible = true;
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该包裹?', '提示', {
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
      handlePackage(row) {
        this.packageItem = row;
        this.packagePositionInfo = row.positionInfo;
        this.packageNote = row.note;
        this.packageDialogVisible = true;
      },
      handleEndStorage(row) {
        this.item = Object.assign({}, row);
        this.order = this.item.orders[0];
        this.order.orderAction = '-1';
        if (this.item.itemStatus === 11) {
          this.actionOptionsAfterStorage = getActionOptionsAfterStorageByLocation(row.location);
        }
        this.dialogEndStorageVisible = true;
      },
      handleUpdate(row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.isFinish = false;
        this.item = Object.assign({},row);
        this.order = Object.assign({},row.orders[0]);
      },
      enlargePhoto(row) {
        this.item = Object.assign({},row);
        this.photoDialogVisible = true;
      },
      checkIfPreload() {
        if (!this.item.deliverySn || !this.item.userSn || !this.item.location) {
          this.$message({
            type: 'error',
            message: '运单号/识别码/入库地点为必填项!'
          });
          return;
        }
        let query = {
          deliverySn: this.item.deliverySn,
          userSn: this.item.userSn,
          location: this.item.location,
        };
        checkIfItemExist(query).then(response => {
          if (response.data) {
            this.dialogVisible = false;
            this.listQuery.deliverySn = query.deliverySn;
            this.listQuery.userSn = query.userSn;
            this.listQuery.location = query.location;
            this.handleSearchList();
            this.$message({
              type: 'success',
              message: '包裹已登记!'
            });
          } else {
            this.$message({
              type: 'warning',
              message: '没有搜索到已登记的包裹!'
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
                message: '操作成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.isFinish = false;
              this.getList();
            }).catch(() => {
              this.dialogVisible = false;
              this.isFinish = false;
              this.getList();
            });
          } else if (this.isInput) {
            updateItemStatus(this.item, this.order.orderAction).then(() => {
              this.order.orderAction = "-1";
              updateOrder(this.order).then(() => {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.isInput = false;
                this.getList();
              })
            }).catch(() => {
              this.dialogVisible = false;
              this.isInput = false;
              this.getList();
            });
          } else if (this.isEdit) {
            if (!this.item.deliverySn || !this.item.userSn || !this.item.location) {
              this.$message({
                type: 'error',
                message: '运单号/识别码/入库地点为必填项!'
              });
              return;
            }
            updateItem(this.item).then(() => {
              if (this.item.userSn !== this.order.userSn) {
                this.order.userSn = this.item.userSn;
                updateOrder(this.order).then(() => {
                  this.$message({
                    message: '修改成功！',
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.isEdit = false;
                  this.getList();
                })
              } else {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.isEdit = false;
                this.getList();
              }
            });
          } else {
            this.item.createTime = new Date();
            //find if item is preloaded or not
            if (!this.item.deliverySn || !this.item.userSn || !this.item.location) {
              this.$message({
                type: 'error',
                message: '运单号/识别码/入库地点为必填项!'
              });
              return;
            }
            let query = {
              deliverySn: this.item.deliverySn,
              userSn: this.item.userSn,
              location: this.item.location,
            };
            checkIfItemExist(query).then(response => {
              if (response.data) {
                this.dialogVisible = false;
                this.listQuery.deliverySn = query.deliverySn;
                this.listQuery.userSn = query.userSn;
                this.listQuery.location = query.location;
                this.handleSearchList();
                this.$message({
                  type: 'warning',
                  message: '包裹已登记!'
                });
              } else {
                this.item.itemStatus = 1;
                this.order.createTime = new Date();
                this.order.userSn = this.item.userSn;
                this.order.deliverySn = this.item.deliverySn;
                this.order.location = this.item.location;
                this.order.note = this.item.note;
                if (!this.order.orderStatus) {
                  this.order.orderStatus = 4;
                }
                if (!this.order.orderAction) {
                  this.order.orderAction = -1;
                  //英国默认集运回国
                  if (this.item.location === "EN") {
                    this.order.orderAction = 0;
                    this.item.itemStatus = 2;
                  }
                }
                createOrder(this.order).then(() => {
                  createItem(this.item).then(() => {
                    this.$message({
                      message: '添加成功！',
                      type: 'success'
                    });
                    this.dialogVisible = false;
                    this.order = Object.assign({}, defaultOrder);
                    this.item = Object.assign({}, defaultItem);
                    this.getList();
                  })
                })
              }
            });
          }
        })
      },
      handleChooseNextActionConfirm () {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.order.storageDays = Math.ceil((Date.now() - Date.parse(this.item.createTime)) / (1000 * 3600 * 24));
          this.order.storageLocation = this.item.location;
          updateOrderByUser(this.order).then(() => {
            updateItemStatusByOrder(this.order).then(() => {
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
      handleOrderDetail(order) {
        this.orderDialogVisible = true;
        this.order = order;
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
      async combinePackages(items) {
        if (this.packageWeightUnit === null || this.packageWeight === null) {
          this.$message({
            type: 'error',
            message: '重量/重量单位为必填!'
          });
          return;
        }
        let mainOrder = null;
        for (const element of items) {
          if (!mainOrder) {
            mainOrder = element.orders[0];
            mainOrder.weightUnit = this.packageWeightUnit;
            mainOrder.weight = this.packageWeight;
            mainOrder.price = this.packagePrice;
            // mainOrder.orderStatus = 0;
            await updateOrder(mainOrder);
          } else {
            await allocOrder(element.id, mainOrder.id).then(() => {
              mainOrder.deliverySn = mainOrder.deliverySn + "&" + element.deliverySn;
              mainOrder.amount++;
              // mainOrder.orderStatus = 0;
              updateOrder(mainOrder);
            });
          }
          element.note = this.packageNote;
          element.positionInfo = this.packagePositionInfo;
          await updateItemStatus(element, mainOrder.orderAction);
        }
        this.$message({
          message: '打包成功！',
          type: 'success'
        });
        this.packageWeightUnit = null;
        this.packageWeight = null;
        this.packagePrice = null;
        this.packageNote = null;
        this.packagePositionInfo = null;
        this.packageDialogVisible = false;
        this.getList();
      },
      async tryCombinePackages() {
        //check if multiple selections match limitation
        if (this.multipleSelection.length === 0) {
          await this.combinePackages(new Array(this.packageItem));
        } else {
          if (this.multipleSelection.map(value => value.userSn).every((val, i, arr) => val === arr[0])
            && this.multipleSelection.map(value => value.orders[0].orderAction).every((val, i, arr) => val === arr[0])
            && this.multipleSelection.map(value => value.orders[0].destination).every((val, i, arr) => val === arr[0])) {
            await this.combinePackages(this.multipleSelection);
          } else {
            this.$message({
              type: 'error',
              message: '所有打包包裹必须是同一识别码和同一操作的!'
            });
            this.packageDialogVisible = false;
          }
        }
      },
      inOutBoundPackages() {
        for(let i=0;i<this.multipleSelection.length;i++) {
          this.multipleSelection[i].note = this.packageNote;
          this.multipleSelection[i].positionInfo = this.packagePositionInfo;
          updateItemStatus(this.multipleSelection[i], this.multipleSelection[i].orders[0].orderAction).then(() => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.inOutBoundDialogVisible = false;
            this.getList();
          }).catch(() => {
            this.inOutBoundDialogVisible = false;
            this.getList();
          });
        }
      },
      handleBatchOperate() {
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的包裹',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.operateType===1){
          //批量入库
          this.inOutBoundDialogVisible = true;
        }else if(this.operateType===2){
          //批量打包
          this.packageDialogVisible = true;
        }else if(this.operateType===3){
          //批量发货
          this.inOutBoundDialogVisible = true;
        }else if(this.operateType===4){
          //批量关闭
        }
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
      getExportList() {
        this.listLoading = true;
        this.listQuery.pageSize = 10000;
        fetchItemList(this.listQuery).then(response => {
          this.getListOrder(response).then(response => {
            this.exportData = response.data.list;
            this.listLoading = false;
          }).then(() => {
            this.exportExcelData('items');
          })
        });
      },
      showEndStorageButton(row) {
        if (!row.orders || row.orders.length < 1) {
          return false;
        }
        return row.itemStatus === 11;
      },
      refreshData() {
        this.getList();
      },
      showNextButton(currentStatus) {
        switch (currentStatus) {
          case 0:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 20:
            return true;
          default:
            return false;
        }
      },
      showPackageButton(currentStatus) {
        switch (currentStatus) {
          case 2:
            return true;
          default:
            return false;
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


