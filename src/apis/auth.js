import request from '@/utils/request'

export function signUp(data) {
  return request.post('/auth/signUp', data)
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
