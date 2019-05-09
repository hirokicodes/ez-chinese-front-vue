<template>
  <section class="section">
    <div class="container has-text-centered">Bookmarks</div>
    <div v-if="me">
      <div
        v-for="(hanzi, i) in me.bookmarkedHanzis"
        :key="i"
      >{{hanzi.simplified}}{{hanzi.definitions}}</div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LOGIN from "@/graphql/mutations/user/LOGIN";
import GET_MY_BOOKMARKED_HANZIS from "../graphql/queries/GET_MY_BOOKMARKED_HANZIS";

enum DisplayType {
  Rows,
  Tiles
}

@Component({
  apollo: {
    me: { query: GET_MY_BOOKMARKED_HANZIS }
  }
})
export default class Bookmarks extends Vue {
  private displayType: DisplayType = DisplayType.Rows;
}
</script>
