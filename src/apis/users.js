import request from '@/utils/request'
import requestFormTest from '@/utils/requestFormTest'
export function getUsers() {
  return request.get('/users')
}

export function fetchMe(data) {
  return request.get('/user/me', data)
}

export function updateUser(data) {
  return requestFormTest.post('/user/update', data)
}
