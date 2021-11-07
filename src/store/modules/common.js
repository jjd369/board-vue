export const state = {
  loading: false,
}

export const mutations = {
  SET_LOADING(state, newValue) {
    state.loading = newValue
  },
}

export const actions = {
  getLoading({ commit }, newValue) {
    commit('SET_LOADING', newValue)
  },
}
