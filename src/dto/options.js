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
  },
  {
    label: '未定价',
    value: 4
  }
]

export const statusOptions = [
  // {
  //   label: '待入库',
  //   value: 0
  // },
  {
    label: '已入库（海外仓）',
    value: 1
  },
  {
    label: '待打包',
    value: 2
  },
  {
    label: '已打包',
    value: 3
  },
  {
    label: '待集运linbo国内仓',
    value: 4
  },
  {
    label: '待直邮国内用户手上',
    value: 5
  },
  {
    label: '待退货',
    value: 6
  },
  {
    label: '待转寄海外其他地址',
    value: 7
  },
  {
    label: '待海外寄存',
    value: 8
  },
  {
    label: '待转寄stockx',
    value: 9
  },
  {
    label: '待代卖stockx',
    value: 20
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
    label: '待入库（国内仓）',
    value: 21
  },
  {
    label: '已入库（国内仓）',
    value: 12
  },
  {
    label: '待国内仓代卖',
    value: 13
  },
  {
    label: '已上架',
    value: 22
  },
  {
    label: '已卖出',
    value: 23
  },
  {
    label: '已结算',
    value: 24
  },
  {
    label: '待顺丰快递',
    value: 14
  },
  {
    label: '待国内仓寄存',
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
    label: '已套现',
    value: 25
  }
]

export const regionOptions = [
  {label:"新泽西", value:'US1'},
  {label:"洛杉矶", value:'US2'},
  {label:"西班牙", value:'SP'},
  {label:"意大利", value:'IT'},
  {label:"荷兰", value:'NL'},
  {label:"德国", value:'DE'},
  {label:"英国", value:'EN'},
  {label:"日本", value:'JP'},
  {label:"澳大利亚", value:'AU'},
  {label:"中国", value:'CN'},
  {label:"香港", value:'HK'},
  {label:"加拿大", value:'CA'},
]

export const weightUnitOptions = [
  {label:"lb", value:0},
  {label:"kg", value:1}
]

export const operateOptions = [
  {
    label: "批量入库",
    value: 1
  },
  {
    label: "批量打包",
    value: 2
  },
  {
    label: "批量发货",
    value: 3
  },
  // {
  //   label: "批量关闭",
  //   value: 4
  // },
]

export function formatDateTime(time) {
  if (time == null || time === '') {
    return '';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm')
}

export function formatAction(actionCode) {
  switch (actionCode) {
    case "0":
      return "集运linbo国内仓";
    case "1":
      return "直邮国内用户手上";
    case "2":
      return "退货";
    case "3":
      return "转寄海外其他地址";
    case "4":
      return "海外寄存";
    case "5":
      return "转寄stockx";
    case "6":
      return "国内仓代卖";
    case "7":
      return "国内仓寄存";
    case "8":
      return "代卖stockx";
    case "9":
      return "顺丰直邮";
    case "10":
      return "套现";
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
    case 4:
      return "未定价";
  }
}

export function formatLocation(location) {
  switch (location) {
    case 'US1':
      return "新泽西";
    case 'US2':
      return "洛杉矶";
    case 'SP':
      return "西班牙";
    case 'IT':
      return "意大利";
    case 'NL':
      return "荷兰";
    case 'DE':
      return "德国";
    case 'EN':
      return "英国";
    case 'JP':
      return "日本";
    case 'AU':
      return "澳大利亚";
    case 'CN':
      return "中国";
    case 'HK':
      return "香港";
    case 'CA':
      return "加拿大";
  }
}

export function formatItemStatus(status) {
  switch (status) {
    case 0:
      return "待入库";
    case 1:
      return "已入库（海外仓）";
    case 2:
      return "待打包";
    case 3:
      return "已打包";
    case 4:
      return "待集运linbo国内仓";
    case 5:
      return "待直邮国内用户手上";
    case 6:
      return "待退货";
    case 7:
      return "待转寄海外其他地址";
    case 8:
      return "待海外寄存";
    case 9:
      return "待转寄stockx";
    case 10:
      return "已发货（海外仓）";
    case 11:
      return "已寄存（海外仓）";
    case 12:
      return "已入库（国内仓）";
    case 13:
      return "待国内仓代卖";
    case 14:
      return "待顺丰快递";
    case 15:
      return "待国内仓寄存";
    case 16:
      return "已发货（国内仓）";
    case 17:
      return "已寄存（国内仓）";
    case 18:
      return "已归档";
    case 20:
      return "待代卖stockx";
    case 21:
      return "待入库（国内仓）";
    case 22:
      return "已上架";
    case 23:
      return "已卖出";
    case 24:
      return "已结算";
    case 25:
      return "已套现";
    default:
      return "未知";
  }
}

export var defaultAddressInfo = {
  id: null,
  receiverName: null,
  phoneNumber: null,
  address: null
}

export var defaultProfile = {
  email: null,
  discordId: null,
  icon: null
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
  orders: [],
  photo: null,
  remark: null
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
  updateTime: null,
  orderStatus: null,
  paymentStatus: null,
  paymentTime: null,
  newDeliverySn: null,
  attachment: null,
  price: null,
  sfPrice: null,
  storageDays: null,
  storageLocation: null,
  overtimeDate: null,
  labelNumber: null,
  userRemark: null,
  chinaSize: null,
  onlineDate: null,
  soldDate: null,
  soldPrice: null,
  techServiceFeePercentage: 0.03,
  techServiceFee: null,
  transactionFee: null,
  duServiceFee: null,
  afterSaleServiceFee: null,
  totalServiceFee: 20,
  userOwnPrice: null,
  realSalePrice: null,
  realTechServiceFee: null,
  realProfit: null,
  isFollowPrice: null,
  clearDate: null
}

export const actionOptions = [
  {label:"待用户选择", value:"-1"},
  {label:"集运linbo国内仓", value:"0"},
  {label:"直邮国内用户手上", value:"1"},
  {label:"退货", value:"2"},
  {label:"转寄海外其他地址", value:"3"},
  {label:"海外寄存", value:"4"},
  {label:"转寄stockx", value:"5"},
  {label:"国内仓代卖", value:"6"},
  {label:"国内仓寄存", value:"7"},
  {label:"代卖stockx", value:"8"},
  {label:"顺丰直邮", value:"9"},
  {label:"套现", value:"10"}
]

export function getActionOptionsByLocation(location) {
  if (location === 'US1') {
    return [
      {label:"待用户选择", value:"-1"},
      {label:"集运linbo国内仓", value:"0"},
      // {label:"直邮国内用户手上", value:"1"},
      {label:"退货", value:"2"},
      {label:"转寄海外其他地址", value:"3"},
      {label:"海外寄存", value:"4"},
      {label:"转寄stockx", value:"5"},
      // {label:"代卖stockx", value:"8"}
    ];
  } else if (location === 'CA') {
    return [
      {label:"待用户选择", value:"-1"},
      {label:"转寄stockx", value:"5"}
    ];
  } else if (location === 'AU') {
    return [
      {label:"待用户选择", value:"-1"},
      {label:"退货", value:"2"},
      {label:"转寄stockx", value:"5"}
    ];
  } else if (location === 'EN') {
    return [
      {label:"待用户选择", value:"-1"},
      {label:"集运linbo国内仓", value:"0"}
    ];
  } else {
    return [
      {label:"待用户选择", value:"-1"},
      {label:"集运linbo国内仓", value:"0"},
      {label:"退货", value:"2"},
      {label:"转寄海外其他地址", value:"3"},
      {label:"海外寄存", value:"4"},
      {label:"转寄stockx", value:"5"},
    ];
  }
}

export function getActionOptionsAfterStorageByLocation(location) {
  if (location === 'US1') {
    return [
      {label:"待用户选择", value:"-1"},
      {label:"集运linbo国内仓", value:"0"},
      {label:"退货", value:"2"},
      {label:"转寄海外其他地址", value:"3"},
      {label:"转寄stockx", value:"5"},
    ];
  } else {
    return [
      {label:"待用户选择", value:"-1"},
      {label:"集运linbo国内仓", value:"0"},
      {label:"转寄海外其他地址", value:"3"},
      {label:"转寄stockx", value:"5"},
    ];
  }
}

export const sizeOptions = [
  {label:"US4", value:"US4"},
  {label:"US4.5", value:"US4.5"},
  {label:"US5", value:"US5"},
  {label:"US5.5", value:"US5.5"},
  {label:"US6", value:"US6"},
  {label:"US6.5", value:"US6.5"},
  {label:"US7", value:"US7"},
  {label:"US7.5", value:"US7.5"},
  {label:"US8", value:"US8"},
  {label:"US8.5", value:"US8.5"},
  {label:"US9", value:"US9"},
  {label:"US9.5", value:"US9.5"},
  {label:"US10", value:"US10"},
  {label:"US10.5", value:"US10.5"},
  {label:"US11", value:"US11"},
  {label:"US11.5", value:"US11.5"},
  {label:"US12", value:"US12"},
  {label:"US12.5", value:"US12.5"},
  {label:"US13", value:"US13"},
  {label:"US13.5", value:"US13.5"},
  {label:"US14", value:"US14"},
  {label:"US14.5", value:"US14.5"},
  {label:"US15", value:"US15"},
  {label:"US15.5", value:"US15.5"},
  {label:"US16", value:"US16"},
  {label:"Small", value:"Small"},
  {label:"Medium", value:"Medium"},
  {label:"Large", value:"Large"},
  {label:"XLarge", value:"XLarge"},
  {label:"XXL", value:"XXL"},
  {label:"XXXL", value:"XXXL"},
  {label:"未知", value:"未知"},
]
