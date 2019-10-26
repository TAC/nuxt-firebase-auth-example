import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { createLocalVue } from '@vue/test-utils'
import users from '@/store/models/users.ts'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store/models/users.ts', () => {
  let store
  let user

  beforeEach(() => {
    // create store
    store = new Vuex.Store({
      modules: {
        'models/users': cloneDeep(users)
      }
    })

    // mock data
    user = {
      uid: 'alice',
      displayName: 'alice',
      email: '',
      emailVerified: false,
      isAnonymous: false,
      phoneNumber: '',
      photoURL: '',
      providerData: []
    }
  })

  describe('getters', () => {
    test('user', () => {
      store.commit('models/users/SET_USER', user)
      expect(store.getters['models/users/user']).toMatchObject(user)
    })

    describe('isAuthenticated', () => {
      test('true', () => {
        store.commit('models/users/SET_USER', user)
        expect(store.getters['models/users/isAuthenticated']).toBeTruthy()
      })
      test('false:not exists', () => {
        store.commit('models/users/UNSET_USER')
        expect(store.getters['models/users/isAuthenticated']).toBeFalsy()
      })
    })
  })

  describe('mutations', () => {
    test('UNSET_USER', () => {
      store.commit('models/users/UNSET_USER')
      expect(store.getters['models/users/user']).toMatchObject({})
    })
  })
})
