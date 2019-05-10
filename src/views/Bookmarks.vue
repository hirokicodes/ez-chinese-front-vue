<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div class="level">
            <div class="level-left">
              <div class="title has-text-centered">Bookmarks</div>
            </div>
            <div class="level-right">
              <span>View:</span>
              <button class="button is-small">
                <i class="fas fa-list"></i>
              </button>
              <button class="button is-small">
                <i class="fas fa-th"></i>
              </button>
            </div>
          </div>
          <template v-if="me">
            <div v-for="(hanzi, i) in me.bookmarkedHanzis" :key="i">
              <div class="box">
                <div class="media">
                  <div class="media-left">{{hanzi.simplified}}</div>
                  <div class="media-content">
                    <div class="content">{{hanzi.definitions}}</div>
                  </div>
                  <div class="media-right">
                    <button class="button is-small">
                      <i class="fas fa-bookmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
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
