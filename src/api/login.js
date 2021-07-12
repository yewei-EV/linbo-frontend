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

export function register(username, password, email, discordId) {
  return request({
    url: '/admin/register',
    method: 'post',
    data: {
      username,
      password,
      email,
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

export function updateAddressInfo(id, params) {
  return request({
    url: '/admin/updateAddressInfo/' + id,
    method: 'post',
    params: {name: params.name, phoneNumber: params.phoneNumber, address: params.address}
  })
}

export function updateProfileInfo(id, params) {
  return request({
    url: '/admin/updateProfileInfo/' + id,
    method: 'post',
    params: {name: params.name, email: params.email, discordId: params.discordId, icon: params.icon}
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
