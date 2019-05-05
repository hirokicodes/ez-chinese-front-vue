<template>
  <div class="container has-text-centered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <h1 class="title">Sign up to CryptoVue</h1>
        <form @submit.prevent="handleSignup">
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Username" v-model="username">
            </div>
          </div>

          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Email" v-model="email">
            </div>
          </div>

          <div class="field">
            <div class="control">
              <input
                class="input"
                type="password"
                placeholder="Password - at least 8 characters"
                v-model="password"
              >
            </div>
          </div>

          <div class="field">
            <div class="control">
              <input
                class="input"
                type="password"
                placeholder="Confirm your password"
                v-model="passwordConfirmation"
              >
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button
                :disabled="!formIsValid"
                class="button is-fullwidth is-dark"
                type="submit"
              >Sign Up</button>
            </div>
            <div v-if="error" class="help is-danger">{{error}}</div>
          </div>

          <h3>
            Already have an account?
            <router-link to="/login">Log in</router-link>
          </h3>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SIGNUP from "@/graphql/mutations/user/SIGNUP";
import GET_ME from "../graphql/queries/GET_ME";

@Component
export default class Signup extends Vue {
  private username = "";
  private email = "";
  private password = "";
  private passwordConfirmation = "";

  private error = "";

  get formIsValid() {
    return (
      this.username.length >= 3 &&
      this.email.length > 5 &&
      this.password.length >= 8 &&
      this.password === this.passwordConfirmation
    );
  }

  public async handleSignup() {
    try {
      const { data } = await this.$apollo.mutate({
        mutation: SIGNUP,
        variables: {
          data: {
            username: this.username,
            email: this.email,
            password: this.password
          }
        }
      });

      if (data.signup) {
        localStorage.setItem("token", data.signup.token);
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
