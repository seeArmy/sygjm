import request from '@/utils/request'

export function getUsers(query) {
  return request({
    url: '/cms/User/LoadUsers',
    method: 'post',
    params: query
  })
}
export function updateUsers(data) {
  return request({
    url: '/cms/user/update',
    method: 'post',
    data
  })
}
export function addUsers(data) {
  return request({
    url: '/cms/user/AddUserInfo',
    method: 'post',
    data
  })
}
export function deleteUsers(query) {
  return request({
    url: '/cms/user/DeleteUsers',
    method: 'post',
    params: query
  })
}
export function getAllRoles() {
  return request({
    url: '/cms/user/GetAllRoles',
    method: 'post'
  })
}
export function getExistRoleIds(query) {
  return request({
    url: '/cms/user/getExistRoleIds',
    method: 'post',
    params: query
  })
}
export function setRole(query) {
  return request({
    url: '/cms/user/SetRole',
    method: 'post',
    params: query
  })
}
export function getRoles(query) {
  return request({
    url: '/cms/Role/LoadRoles',
    method: 'post',
    params: query
  })
}
export function addRole(data) {
  return request({
    url: '/cms/role/AddRole',
    method: 'post',
    data
  })
}
export function deleteRole(query) {
  return request({
    url: '/cms/role/DeleteRoles',
    method: 'post',
    params: query
  })
}
export function updateRole(data) {
  return request({
    url: '/cms/role/UpdateRole',
    method: 'post',
    data
  })
}
export function getActions(query) {
  return request({
    url: '/cms/action/Loadactions',
    method: 'post',
    params: query
  })
}
export function addAction(data) {
  return request({
    url: '/cms/action/AddAction',
    method: 'post',
    data
  })
}
export function getAllActions(query) {
  return request({
    url: 'cms/ActionGroup/getAllActions',
    method: 'post',
    params: query
  })
}
export function getExistActionIds(query) {
  return request({
    url: 'cms/ActionGroup/getExistActionIds',
    method: 'post',
    params: query
  })
}
export function setActions(query) {
  return request({
    url: 'cms/ActionGroup/SetActions',
    method: 'post',
    params: query
  })
}
export function updateAction(data) {
  return request({
    url: '/cms/action/Update',
    method: 'post',
    data
  })
}
export function deleteActions(query) {
  return request({
    url: '/cms/action/DeleteActions',
    method: 'post',
    params: query
  })
}
export function getActionGroups(query) {
  return request({
    url: '/cms/actiongroup/Loadactiongroups',
    method: 'post',
    params: query
  })
}
export function getAllGroups(query) {
  return request({
    url: 'cms/Role/getAllGroups',
    method: 'post',
    params: query
  })
}
export function getExistGroupIds(query) {
  return request({
    url: 'cms/role/getExistGroupIds',
    method: 'post',
    params: query
  })
}
export function setGroups(query) {
  return request({
    url: 'cms/Role/SetGroups',
    method: 'post',
    params: query
  })
}
export function addActionGroup(data) {
  return request({
    url: '/cms/actiongroup/AddGroup',
    method: 'post',
    data
  })
}
export function updateActionGroups(data) {
  return request({
    url: '/cms/actiongroup/UpdateActionGroups',
    method: 'post',
    data
  })
}
export function deleteActionGroups(data) {
  return request({
    url: '/cms/actiongroup/DeleteActionGroups',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
