import request from '@/utils/request'

export function fetchItemList(params) {
  return request({
    url: '/item/list',
    method: 'post',
    data: params
  })
}

export function checkIfItemExist(params) {
  return request({
    url: '/item/checkIfExist',
    method: 'get',
    params: params
  })
}

export function fetchItemOrders(itemId) {
  return request({
    url: '/item/order/' + itemId,
    method: 'get',
  })
}

export function fetchRelatedItems(orderId) {
  return request({
    url: '/item/fetchRelatedItemsByOrder/',
    method: 'get',
    params: {orderId: orderId}
  })
}

export function fetchOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params: params
  })
}

export function createItem(data) {
  return request({
    url: '/item/create',
    method: 'post',
    data: data
  })
}

export function updateItem(data) {
  return request({
    url: '/item/update/' + data.id,
    method: 'post',
    data: data
  })
}

export function updateItemStatus(data, orderAction) {
  return request({
    url: '/item/updateStatus/' + orderAction,
    method: 'post',
    data: data
  })
}

export function updateItemStatusByOrder(data) {
  return request({
    url: '/item/updateStatusByOrder',
    method: 'post',
    data: data
  })
}

export function refreshItemStatusByOrder(data) {
  return request({
    url: '/item/refreshItemStatusByOrder/' + data.id,
    method: 'get',
    params: {'orderAction': data.orderAction}
  })
}

export function deleteItem(id) {
  return request({
    url: '/item/delete/',
    method: 'post',
    params: {'ids': id}
  })
}

export function allocOrder(itemId, orderId) {
  return request({
    url: '/item/allocateOrder/update',
    method: 'post',
    data: {'itemId': itemId, 'orderId': orderId}
  })
}

export function createOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data: data
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/update/' + data.id,
    method: 'post',
    data: data
  })
}

export function updateOrderByUser(data) {
  return request({
    url: '/order/updateAction/' + data.id,
    method: 'post',
    params: {
      'orderAction': data.orderAction?data.orderAction:'',
      'destination': data.destination?data.destination:'',
      'attachment': data.attachment?data.attachment:'',
      'storageDays': data.storageDays?data.storageDays:'',
      'storageLocation': data.storageLocation?data.storageLocation:'',
      'overtimeDate': data.overtimeDate?data.overtimeDate:'',
      'labelNumber': data.labelNumber?data.labelNumber:'',
      'userRemark': data.userRemark?data.userRemark:'',
      'chinaSize': data.chinaSize?data.chinaSize:'',
      'isFollowPrice': data.isFollowPrice?data.isFollowPrice:'',
    }
  })
}

export function deleteOrder(id) {
  return request({
    url: '/order/delete/',
    method: 'post',
    params: {'ids': id}
  })
}

export function fetchItemCount(data) {
  return request({
    url: '/item/itemCount',
    method: 'post',
    data: data
  })
}

export function fetchOrderCount(data) {
  return request({
    url: '/order/orderCount',
    method: 'post',
    data: data
  })
}

export function fetchSalesCount(params) {
  return request({
    url: '/order/orderPriceCount',
    method: 'get',
    params: params
  })
}

export function aliPay(params) {
  return request({
    url: '/alipay/pay',
    method: 'post',
    data: params
  })
}
