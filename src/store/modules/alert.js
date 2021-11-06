export const state = {
  alert_on: false,
  alert_title: '',
  alert_type: '',
}

export const getters = {}

export const mutations = {
  ALERT_HANDLER(state, newValue) {
    state.alert_on = true
    state.alert_type = newValue.type
    state.alert_title = newValue.title
    setTimeout(() => {
      state.alert_on = false
    }, 2000)
  },
}

export const actions = {
  alertTrigger({ commit }, newValue) {
    commit('ALERT_HANDLER', newValue)
  },
}
