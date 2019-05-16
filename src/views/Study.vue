<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div class="level" v-if="deck">
            <div class="level-left">
              <div class="title has-text-centered">Deck: {{deck.name}}</div>
            </div>
            <div class="level-right">
              <span>right</span>
            </div>
          </div>
          <template v-if="deck">
            <div class="box has-text-centered" @click="flipFlashcard">
              <div v-if="!showFlashcardBack">
                <p class="is-size-1">{{currentFlashcard.hanzi.simplified}}</p>
              </div>
              <div v-else>
                <p class="is-size-1">{{currentFlashcard.hanzi.definitions}}</p>
                <span>Comfort level: {{currentFlashcard.comfortLevel}}</span>
                <div class="level">
                  <div class="level-left">
                    <button class="button" @click.self.stop="goToPrevFlashcard">Prev</button>
                  </div>
                  <div class="level-right">
                    <button class="button" @click.self.stop="goToNextFlashcard">Next</button>
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import GET_DECK from "../graphql/queries/GET_DECK";
import GET_MY_FLASHCARDS from "@/graphql/queries/GET_MY_FLASHCARDS";
import { Types } from "@/types/types";

enum DisplayType {
  List,
  Grid
}

@Component({
  apollo: {
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
export default class Study extends Vue {
  private deck: null | Types.Deck = null;
  private showFlashcardBack: boolean = false;
  private currentFlashcardIndex: number = 0;
  private flashcardsToStudy: Types.Flashcard[] = [];

  created() {
    console.log(this.$route);
  }

  get currentFlashcard() {
    return this.flashcardsToStudy[this.currentFlashcardIndex];
  }

  @Watch("deck")
  onDeckChange() {
    if (this.deck) {
      this.flashcardsToStudy = this.deck.flashcards;
      this.shuffleArray(this.flashcardsToStudy);
    }
  }

  @Watch("currentFlashcardIndex")
  onCurrentFlashcardIndexChange() {
    this.showFlashcardBack = false;
  }

  private goToNextFlashcard() {
    this.currentFlashcardIndex += 1;
  }

  private goToPrevFlashcard() {
    this.currentFlashcardIndex -= 1;
  }

  private flipFlashcard() {
    this.showFlashcardBack = !this.showFlashcardBack;
  }

  private shuffleArray(array: Types.Flashcard[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  height: 60vh;
}
</style>
