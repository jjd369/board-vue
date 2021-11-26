import request from '@/utils/request'
import requestFormTest from '@/utils/requestFormTest'

export function insertBoard(data) {
  return requestFormTest.post('/board/write', data)
}

export function getAllBoard(params) {
  return request({
    url: '/board/boards',
    method: 'get',
    params,
  })
}

export function getBoard(id) {
  return request.get(`/board/boards/${id}`)
}

export function deleteBoard(data) {
  return request.delete('/board/delete', { data })
}

export function updateBoard(data) {
  return requestFormTest.post('/board/update', data)
}
