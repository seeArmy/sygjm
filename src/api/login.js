import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/cms/Login/UserLogin',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/cms/Login/LogOut',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'cms/User/LoadMenuData',
    method: 'get',
    params: { token }
  })
}

