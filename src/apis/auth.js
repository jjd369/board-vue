import request from '@/utils/request'
import requestFormTest from '@/utils/requestFormTest'

export function signUp(data) {
  return requestFormTest.post('/auth/signUp', data)
}

export function signIn(data) {
  return request.post('/auth/signIn', data)
}

export function signOut(data) {
  return request.delete('/auth/signOut', data)
}

export function token(data) {
  return request.post('/auth/refreshToken', data)
}
