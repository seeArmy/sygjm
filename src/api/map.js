import request from '@/utils/request'

export function getPositionByUserId(query) {
  return request({
    url: '/cms/mappoint/getuserpoints',
    method: 'post',
    params: query
  })
}
export function getAllUserTypes() {
  return request({
    url: '/cms/usertype/getalltypeusers',
    method: 'post'
  })
}
export function freshMessage() {
  return request({
    url: '/cms/Message/GetAllMessages',
    method: 'post'
  })
}

