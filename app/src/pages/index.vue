<template lang="pug">
  section.container
    template(v-if='isAuthenticated')
      ButtonsAction(@action='signOut')
        template(v-slot:buttonText) SignOut
      p {{ user.uid }} : {{ user.displayName }}
    template(v-else)
      ButtonsAction(@action='signInGoogle')
        template(v-slot:buttonText) Sign-In Google
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { setCookie, removeCookie } from '@/helpers/cookies'
import ButtonsAction from '@/components/buttons/Action.vue'
import firebase from '@/plugins/firebase'
import 'firebase/auth'

const Users = namespace('models/users')
const Auth = namespace('modules/auth')

@Component({
  components: {
    ButtonsAction
  }
})
export default class extends Vue {
  @Users.Getter('user') user
  @Users.Getter('isAuthenticated') isAuthenticated
  @Auth.Action('signInGoogle') authSignInGoogle
  @Auth.Action('signOut') authSignOut

  private signInGoogle() {
    const that = this as any
    this.authSignInGoogle().then(() => {
      const currentUser = firebase.auth().currentUser
      if (currentUser) {
        currentUser.getIdToken().then(token => {
          setCookie(that.$cookies, 'token', token, that.$isLocalhost)
        })
      }
    })
  }

  private signOut() {
    const that = this as any
    this.authSignOut().then(() => {
      removeCookie(that.$cookies, 'token', that.$isLocalhost)
    })
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
