import request from '@/utils/request'

export function getPositionByUserId(query) {
  return request({
    url: '/cms/mappoint/getuserpoints',
    method: 'post',
    params: query
  })
}
export function getAllUserTypes(query) {
  return request({
    url: '/cms/usertype/getalltypeusers',
    method: 'post',
    params: query
  })
}
export function freshMessage() {
  return request({
    url: '/cms/Message/GetAllMessages',
    method: 'post'
  })
}
export function sendMessage(data) {
  return request({
    url: '/cms/Message/SendToMessage',
    method: 'post',
    params: data
  })
}

