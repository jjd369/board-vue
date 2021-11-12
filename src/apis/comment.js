import request from '@/utils/request'

export function getComments() {
  return request.get('/comment/comments')
}

export function commentToBoard(data) {
  return request.post('/comment/writeToBoard', data)
}

export function commentToComment(data) {
  return request.post('/comment/writeToComment', data)
}

export function updateComment(data) {
  return request.patch('/comment/update', data)
}

export function deleteComment(data) {
  return request.delete('/comment/delete', { data })
}
