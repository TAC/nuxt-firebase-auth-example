import 'firebase/auth'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import firebase from '@/plugins/firebase'
import auth from '@/store/modules/auth.ts'
import users from '@/store/models/users.ts'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store/modules/auth.ts', () => {
  let store
  let user

  beforeAll(() => {
    firebase.auth().autoFlush()
  })

  beforeEach(() => {
    // create store
    store = new Vuex.Store({
      modules: {
        'modules/auth': cloneDeep(auth),
        'models/users': cloneDeep(users)
      }
    })

    // mock data
    user = {
      uid: 'alice',
      email: 'alice@mail.com'
    }

    // initialize auth
    firebase
      .auth()
      .createUser(user)
      .then(user => {
        firebase.auth().changeAuthState(user)
      })
  })

  describe('actions', () => {
    test('isSignIn', async () => {
      await store.dispatch('modules/auth/isSignIn')
      const result = store.getters['models/users/get']
      expect(result).toMatchObject(user)
    })

    test('signOut', async () => {
      await store.dispatch('modules/auth/signOut')
      const result = store.getters['models/users/get']
      expect(result).toBeNull()
    })

    test('signInGoogle', async () => {
      firebase.auth().signInWithPopup = jest.fn(provider => {
        return new Promise(resolve => {
          user.providerData = [provider]
          resolve({
            user
          })
        })
      })

      await store.dispatch('modules/auth/signInGoogle')
      await flushPromises()

      const result = store.getters['models/users/get']
      expect(result.providerData[0]).toMatchObject({
        providerId: 'google.com'
      })
    })
  })
})
