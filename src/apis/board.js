import request from '@/utils/request'

export function insertBoard(data) {
  return request.post('/board/write', data)
}

export function getAllBoard() {
  return request.get('/board/boards')
}

export function getBoard(id) {
  return request.get(`/board/boards/${id}`)
}
