import request from '@/utils/request'

export function getUsers() {
  return request.get('/users')
}

export function fetchMe(data) {
  return request.get('/user/me', data)
}

export function updateUser(data) {
  return request.post('/user/update', data)
}
