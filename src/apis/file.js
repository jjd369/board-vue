import request from '@/utils/request'

export function downloadFile(params) {
  return request.get(`/file/${params}`)
}
