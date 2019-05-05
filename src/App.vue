<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Navbar from "@/components/Navbar.vue";
import GET_ME from "@/graphql/queries/GET_ME";

@Component({
  components: {
    Navbar
  }
})
export default class App extends Vue {
  async created() {
    console.log("app created");
    try {
      const { data } = await this.$apollo.query({
        query: GET_ME
      });
      if (data.me) {
        this.$store.dispatch("changeLoggedInState", true);
      }
    } catch (err) {
      console.error(err);
      this.$store.dispatch("changeLoggedInState", false);
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  margin-top: 3rem;
}
</style>
