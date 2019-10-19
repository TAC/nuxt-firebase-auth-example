import { VuexModule, Module, mutation } from 'vuex-class-component'

interface User {
  [key: string]: any
}

@Module({ namespacedPath: 'models/users/', target: 'nuxt' })
class Store extends VuexModule {
  private user: User | null = null

  get get() {
    return this.user
  }

  get isAuthenticated() {
    return !!this.user
  }

  @mutation
  public SET_USER(payload) {
    const uid = payload.uid !== undefined ? payload.uid : payload.user_id
    const displayName =
      payload.displayName !== undefined ? payload.displayName : payload.name
    const emailVerified =
      payload.emailVerified !== undefined
        ? payload.emailVerified
        : payload.email_verified
    const photoURL =
      payload.photoURL !== undefined ? payload.photoURL : payload.picture
    this.user = {
      uid,
      displayName,
      email: payload.email,
      emailVerified,
      isAnonymous: payload.isAnonymous,
      phoneNumber: payload.phoneNumber,
      photoURL,
      providerData: payload.providerData
    }
  }

  @mutation
  public UNSET_USER() {
    this.user = null
  }
}

export default Store.ExtractVuexModule(Store)
