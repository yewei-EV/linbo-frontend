import {formatDate} from "../utils/date";

export var orderStatusOptions = [
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
]

export const statusOptions = [
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
]

export const regionOptions = [
  {label:"美国1", value:'US1'},
  {label:"美国2", value:'US2'},
  {label:"西班牙", value:'SP'},
  {label:"欧洲", value:'EU'}
]

export const weightUnitOptions = [
  {label:"lb", value:'0'},
  {label:"kg", value:'1'}
]

export const operateOptions = [
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

export function formatDateTime(time) {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm')
}

export function formatAction(actionCode) {
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

export function formatWeightUnit(weightUnit) {
  switch (weightUnit) {
    case 0:
      return "lb";
    case 1:
      return "kg";
  }
}

export function formatOrderStatus(orderStatus) {
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

export var defaultItem = {
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
}

export var defaultOrder = {
  id: null,
  orderAction: null,
  amount: null,
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
  attachment: null,
  price: null
}

export const actionOptions = [
  {label:"待确认", value:"-1"},
  {label:"集运国内", value:"0"},
  {label:"直邮国内", value:"1"},
  {label:"退货", value:"2"},
  {label:"快递海外", value:"3"},
  {label:"海外寄存", value:"4"},
  {label:"StockX寄卖", value:"5"},
  {label:"得物寄卖", value:"6"},
  {label:"国内寄存", value:"7"}
]
