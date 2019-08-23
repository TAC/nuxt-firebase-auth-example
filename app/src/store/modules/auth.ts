import {
  VuexModule,
  Module,
  action,
  getRawActionContext
} from 'vuex-class-component'
import firebase from '@/plugins/firebase'
import 'firebase/auth'

@Module({ namespacedPath: 'modules/auth/', target: 'nuxt' })
class Store extends VuexModule {
  @action({ mode: 'raw' })
  public async signIn(provider) {
    const context = getRawActionContext(this)
    context.commit('models/users/UNSET_USER', null, { root: true })
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        if (result.user) {
          context.commit('models/users/SET_USER', result.user, { root: true })
        }
      })
      .catch(error => {
        console.error(error)
        throw error
      })
  }

  @action()
  public async signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    await this.signIn(provider)
  }

  @action({ mode: 'raw' })
  public async signOut() {
    const context = getRawActionContext(this)
    await firebase
      .auth()
      .signOut()
      .then(() => {
        context.commit('models/users/UNSET_USER', null, { root: true })
      })
  }

  @action({ mode: 'raw' })
  public isSignIn() {
    const context = getRawActionContext(this)
    return new Promise(resolve => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        unsubscribe()
        if (user) {
          context.commit('models/users/SET_USER', user, { root: true })
        }
        resolve(user || false)
      })
    })
  }
}

export default Store.ExtractVuexModule(Store)
