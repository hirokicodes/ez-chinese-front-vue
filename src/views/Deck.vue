<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div class="level" v-if="deck">
            <div class="level-left">
              <div class="title has-text-centered">Deck: {{deck.name}}</div>
              <button class="button" @click="goToStudyPage">Study</button>
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
          <template v-if="deck">
            <template v-if="displayType === 0">
              <div v-for="(flashcard, i) in deck.flashcards" :key="i">
                <div class="box">
                  <div class="media">
                    <div class="media-left">{{flashcard.hanzi.simplified}}</div>
                    <div class="media-content">
                      <div class="content">{{flashcard.hanzi.definitions}}</div>
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
import GET_DECK from "../graphql/queries/GET_DECK";
import GET_MY_FLASHCARDS from "@/graphql/queries/GET_MY_FLASHCARDS";
import { Types } from "@/types/types";

enum DisplayType {
  List,
  Grid
}

@Component({
  apollo: {
    me: {
      query: GET_MY_FLASHCARDS
    },
    deck: {
      query: GET_DECK,
      variables() {
        return {
          id: this.$route.params.id
        };
      }
    }
  }
})
export default class Deck extends Vue {
  private displayType: DisplayType = DisplayType.List;
  private deck: null | Types.Deck = null;

  created() {
    console.log(this.$route);
  }

  private setDisplayTypeToList() {
    this.displayType = DisplayType.List;
  }

  private setDisplayTypeToGrid() {
    this.displayType = DisplayType.Grid;
  }

  private goToStudyPage() {
    if (this.deck) {
      this.$router.push(`/study/${this.deck.id}`);
    }
  }
}
</script>
