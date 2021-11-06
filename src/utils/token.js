import VueCookies from 'vue-cookies'

export function getToken() {
  return VueCookies.get('accessToken')
}

export function getRefreshToken() {
  return VueCookies.get('refreshToken')
}

export function hasToken() {
  return !!getToken()
}

export function hasRefreshToken() {
  return !!getRefreshToken()
}
