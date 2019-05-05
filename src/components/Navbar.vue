<template>
  <div>
    <nav class="navbar is-white is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link
          to="/"
          tag="span"
          style="cursor: pointer"
          class="navbar-item has-text-grey-darker has-text-weight-semibold"
        >EZ Chinese</router-link>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <template v-if="isLoggedIn">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link"></a>
              <div class="navbar-dropdown is-right">
                <hr class="navbar-divider">
                <a class="navbar-item has-text-grey-darker" @click="handleLogout">Logout</a>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="navbar-item">
              <div class="buttons">
                <router-link to="/login" class="button is-white">
                  <strong>Log in</strong>
                </router-link>
                <router-link to="/signup" class="button is-light">
                  <strong>Sign up</strong>
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { apolloClient } from "@/main";

@Component
export default class Navbar extends Vue {
  get isLoggedIn() {
    return !!this.$store.state.loggedIn;
  }

  private handleLogout() {
    this.$store.dispatch("changeLoggedInState", false);
    localStorage.setItem("token", "");
    apolloClient.resetStore();
  }
}
</script>
