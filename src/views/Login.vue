<template>
  <div class="container has-text-centered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <h1 class="title">Log in to EZ Chinese</h1>
        <form @submit.prevent="handleLogin">
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Email" v-model="email">
            </div>
          </div>

          <div class="field">
            <div class="control">
              <input class="input" type="password" placeholder="Password" v-model="password">
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button
                :disabled="!formIsValid"
                class="button is-fullwidth is-dark"
                type="submit"
              >Log in</button>
            </div>
            <div
              v-if="error"
              class="help is-danger"
            >The username and password you entered did not match our records. Please try again.</div>
          </div>

          <h3>
            Don't have an account?
            <router-link to="/signup">Sign up</router-link>
          </h3>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LOGIN from "@/graphql/mutations/user/LOGIN";
import GET_ME from "../graphql/queries/GET_ME";

@Component
export default class Login extends Vue {
  private email = "";
  private password = "";

  private error = "";

  get formIsValid() {
    return this.email.length > 5 && this.password.length >= 8;
  }

  public async handleLogin() {
    try {
      const { data } = await this.$apollo.mutate({
        mutation: LOGIN,
        variables: {
          email: this.email,
          password: this.password
        }
      });

      if (data.login) {
        localStorage.setItem("token", data.login.token);
        this.$store.dispatch("changeLoggedInState", true);
        this.getMe();
        this.$router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  public async getMe() {
    try {
      const { data } = await this.$apollo.query({
        query: GET_ME
      });
    } catch (err) {
      console.error(err);
    }
  }
}
</script>
