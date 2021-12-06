import request from '@/utils/request'

export function downloadFile(key) {
  return request.get(`file/${key}`)
}
