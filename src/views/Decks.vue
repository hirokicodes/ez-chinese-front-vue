<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div class="level">
            <div class="level-left">
              <div class="title has-text-centered">Decks</div>
            </div>
            <div class="level-right">
              <span>View:</span>
              <button class="button is-small" @click="setDisplayTypeToList">
                <i class="fas fa-list"></i>
              </button>
              <button class="button is-small" @click="setDisplayTypeToGrid">
                <i class="fas fa-th"></i>
              </button>
            </div>
          </div>
          <template v-if="me">
            <template v-if="displayType === 0">
              <div class="box" v-for="(deck, i) in me.decks" :key="i">
                <div class="media">
                  <div class="media-left">
                    <router-link :to="`/deck/${deck.id}`">{{deck.name}}</router-link>
                  </div>
                  <div class="media-content">
                    <div class="content">{{deck.description}}</div>
                  </div>
                  <div class="media-right">
                    <button class="button is-small">
                      <i class="fas fa-bookmark"></i>
                    </button>
                    <button class="button is-small" @click="goToStudyRoute(deck.id)">
                      <i class="fas fa-book-open"></i>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="displayType === 1">
              <div class="columns is-multiline is-mobile">
                <!-- <div
                  v-for="(flashcard, i) in flashCardsToShow"
                  :key="i"
                  class="column is-one-quarter-desktop is-one-quarter-tablet is-half-mobile"
                >
                  <FlashcardTile :flashcard="flashcard" :me="me"/>
                </div>-->
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </section>
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

  private goToStudyRoute(deckId: string) {
    this.$router.push(`/study/${deckId}`);
  }
}
</script>
