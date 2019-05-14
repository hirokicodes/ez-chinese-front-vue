<template>
  <section class="section">Decks</section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GET_MY_DECKS from "../graphql/queries/GET_MY_DECKS";

enum DisplayType {
  List,
  Grid
}

@Component({
  apollo: {
    me: { query: GET_MY_DECKS }
  }
})
export default class Decks extends Vue {
  private displayType: DisplayType = DisplayType.List;

  private setDisplayTypeToList() {
    this.displayType = DisplayType.List;
  }

  private setDisplayTypeToGrid() {
    this.displayType = DisplayType.Grid;
  }
}
</script>
