import { signIn, signOut } from '@/apis/auth'
import { fetchMe } from '@/apis/users'
import { hasToken, getRefreshToken } from '@/utils/token'
import VueCookies from 'vue-cookies'
import { Message } from 'element-ui'
import router from '@/router'

export const state = {
  current_user: {
    name: '',
    image: '',
    email: '',
  },
  logged_in: false,
}

export const getters = {
  logged_in: (state) => (!state.current_user.email ? false : true),
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
      await commit('SET_CURRENT_USER', data)
    }
  },
  getCurrentUser({ commit }, userInfo) {
    commit('SET_CURRENT_USER', userInfo)
  },
  login({ commit, dispatch }, userInfo) {
    dispatch('common/getLoading', true, { root: true })
    signIn(userInfo)
      .then(({ data }) => {
        VueCookies.set('refreshToken', data.refreshToken)
        VueCookies.set('accessToken', data.accessToken)
        commit('SET_CURRENT_USER', {
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
          image: data.image,
        })
        Message({
          showClose: true,
          message: `${data.name}님이 로그인 되었습니다.`,
          type: 'success',
        })
        router.push({ name: 'boardList' })
      })
      .catch((err) => {
        Message({
          showClose: true,
          message: err.response.data.errors.message,
          type: 'error',
        })
      })
      .finally(() => {
        dispatch('common/getLoading', false, { root: true })
      })
  },
  async logout({ commit }) {
    VueCookies.remove('refreshToken')
    VueCookies.remove('accessToken')
    await signOut({ refreshToken: getRefreshToken() })
    commit('SET_CURRENT_USER', { name: '', image: '', email: '' })
  },
}
