import request from '@/utils/request'

export function fetchItemCount(params) {
  return request({
    url: '/item/itemCount',
    method: 'get',
    params: params
  })
}

export function fetchSalesCount(params) {
  return request({
    url: '/order/orderPriceCount',
    method: 'get',
    params: params
  })
}

export function modifyItemStatus(params) {
  return request({
    url: '/item/modifyStatus',
    method: 'get',
    params: params
  })
}
