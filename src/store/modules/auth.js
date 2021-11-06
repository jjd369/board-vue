import { signIn, signOut } from '@/apis/auth'
import { fetchMe } from '@/apis/users'
import { hasToken, getRefreshToken } from '@/utils/token'
import VueCookies from 'vue-cookies'
import { Message } from 'element-ui'
import router from '@/router'

export const state = {
  current_user: null,
}

export const getters = {
  logged_in: (state) => (!state.current_user ? false : true),
}

export const mutations = {
  SET_CURRENT_USER(state, newVal) {
    state.current_user = newVal
  },
}

export const actions = {
  async init({ commit }) {
    if (hasToken()) {
      const { data } = await fetchMe()
      await commit('SET_CURRENT_USER', data.name)
      router.push({ name: 'board' }).catch(() => {})
    }
  },
  getCurrentUser({ commit }, user) {
    commit('SET_CURRENT_USER', user)
  },
  login({ commit }, userInfo) {
    signIn(userInfo)
      .then(({ data }) => {
        VueCookies.set('refreshToken', data.refreshToken)
        VueCookies.set('accessToken', data.accessToken)
        commit('SET_CURRENT_USER', data.name)
        Message({
          message: `${data.name}로그인 되었습니다.`,
          type: 'success',
        })
        router.push({ name: 'board' })
      })
      .catch((err) => {
        Message({
          message: err.response.data.message,
          type: 'error',
        })
      })
  },
  async logout({ commit }) {
    await signOut({ refreshToken: getRefreshToken() })
    VueCookies.remove('refreshToken')
    VueCookies.remove('accessToken')
    commit('SET_CURRENT_USER', null)
  },
}
