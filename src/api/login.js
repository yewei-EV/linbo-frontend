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

export function register(username, password, email, wechat, discordId) {
  return request({
    url: '/admin/register',
    method: 'post',
    data: {
      username,
      password,
      email,
      wechat,
      discordId
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function getAnnouncement() {
  return request({
    url: '/announcement/info',
    method: 'get',
  })
}

export function updateAnnouncement(data) {
  return request({
    url: '/announcement/update',
    method: 'post',
    data: {
      id:1,
      announcement: data
    }
  })
}

export function createAddress(data) {
  return request({
    url: '/address/create',
    method: 'post',
    data: data
  })
}

export function updateAddress(data) {
  return request({
    url: '/address/update/' + data.id,
    method: 'post',
    data: data
  })
}

export function deleteAddress(id) {
  return request({
    url: '/address/delete/' + id,
    method: 'post'
  })
}

export function allocateAddress(adminId, addressId) {
  return request({
    url: '/admin/allocateAddress/update',
    method: 'post',
    data: {'adminId': adminId, 'addressId': addressId}
  })
}

export function getAddressList(id) {
  return request({
    url: '/admin/address/' + id,
    method: 'get',
  })
}

export function updateProfileInfo(id, params) {
  return request({
    url: '/admin/updateProfileInfo/' + id,
    method: 'post',
    params: {name: params.name, email: params.email, wechat: params.wechat, discordId: params.discordId, icon: params.icon}
  })
}

export function updatePassword(data) {
  return request({
    url: '/admin/updatePassword/',
    method: 'post',
    data: data
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

export function createAdmin(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data: data
  })
}

export function updateAdmin(id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
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

export function getAdminByDiscordId(discordId) {
  return request({
    url: '/admin/discordId/' + discordId,
    method: 'get'
  })
}

export function getAdminByUserSn(userSn) {
  return request({
    url: '/admin/userSn/' + userSn,
    method: 'get'
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

export function getLog(params) {
  return request({
    url: '/log/list',
    method: 'post',
    data: params
  })
}
