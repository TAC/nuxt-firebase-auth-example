import jwtDecode from 'jwt-decode'
import { getCookie } from '@/helpers/cookies'

export const actions = {
  nuxtServerInit: ({ commit }, { app }) => {
    const token = getCookie(app.$cookies, 'token')
    if (token) {
      commit('models/users/SET_USER', jwtDecode(token))
    }
  }
}
