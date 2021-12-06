import request from '@/utils/request'

export function sendMail(data) {
  return request.post('/mail/send', data)
}
