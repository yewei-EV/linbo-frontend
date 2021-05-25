import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function fetchList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function fetchItemList(params) {
  return request({
    url: '/item/list',
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
export function deleteItem(id) {
  return request({
    url: '/item/delete/',
    method: 'post',
    params: {'ids': id}
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
export function deleteOrder(id) {
  return request({
    url: '/order/delete/',
    method: 'post',
    params: {'ids': id}
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

export function getRoleByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function allocRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}
