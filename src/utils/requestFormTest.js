import axios from 'axios'
import { getToken, hasToken, getRefreshToken } from '@/utils/token'
import { token } from '@/apis/auth'
import VueCookies from 'vue-cookies'

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

instance.interceptors.request.use(
  async (config) => {
    console.log(config)
    config.headers['Content-Type'] = 'multipart/form-data'

    const accessToken = getToken()

    if (hasToken()) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response.status === 401) {
      const { data } = await token({ refreshToken: getRefreshToken() })
      VueCookies.set('accessToken', data.accessToken)
      error.config.headers.Authorization = `Bearer ${data.accessToken}`
      return instance.request(error.config)
    }

    return Promise.reject(error)
  }
)
export default instance
