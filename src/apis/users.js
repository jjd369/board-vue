import request from '@/utils/request'

export function getUsers() {
  return request.get('/users')
}

export function fetchMe(data) {
  return request.get('/user/me', data)
}
