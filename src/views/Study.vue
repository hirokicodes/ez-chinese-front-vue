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
          <template v-if="deck && flashcardsToStudy.length > 0">
            <div class="box has-text-centered" @click.self.stop="flipFlashcard">
              <div class="level">
                <div class="level-left">
                  <button
                    v-show="prevCardExists"
                    class="button"
                    @click.self.stop="goToPrevFlashcard"
                  >
                    <i class="fas fa-arrow-left"></i>
                  </button>
                </div>
                <div class="level-right">
                  <button
                    v-show="nextCardExists"
                    class="button"
                    @click.self.stop="goToNextFlashcard"
                  >
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div v-if="!showFlashcardBack">
                <p class="is-size-1">{{currentFlashcard.hanzi.simplified}}</p>
              </div>
              <div v-else>
                <div class="is-size-1">{{currentFlashcard.hanzi.pinyinDiacritic}}</div>
                <div class="is-size-1">{{currentFlashcard.hanzi.definitions}}</div>
                <div>Comfort level: {{currentFlashcard.comfortLevel}}</div>
                <div>
                  <input
                    type="radio"
                    :value="1"
                    name="comfortLevel"
                    v-model="currentFlashcard.comfortLevel"
                  >
                  1
                  <input
                    type="radio"
                    :value="2"
                    name="comfortLevel"
                    v-model="currentFlashcard.comfortLevel"
                  >
                  2
                  <input
                    type="radio"
                    :value="3"
                    name="comfortLevel"
                    v-model="currentFlashcard.comfortLevel"
                  >
                  3
                  <input
                    type="radio"
                    :value="4"
                    name="comfortLevel"
                    v-model="currentFlashcard.comfortLevel"
                  >
                  4
                  <input
                    type="radio"
                    :value="5"
                    name="comfortLevel"
                    v-model="currentFlashcard.comfortLevel"
                  >
                  5
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
import CHANGE_FLASHCARD_COMFORT_LEVEL from "@/graphql/mutations/flashcard/CHANGE_FLASHCARD_COMFORT_LEVEL";
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

  get currentFlashcard(): Types.Flashcard {
    return this.flashcardsToStudy[this.currentFlashcardIndex];
  }

  @Watch("deck")
  onDeckChange() {
    if (this.deck && this.deck.flashcards.length > 0) {
      this.flashcardsToStudy = this.deck.flashcards;
      this.shuffleArray(this.flashcardsToStudy);
    }
  }

  @Watch("currentFlashcardIndex")
  onCurrentFlashcardIndexChange() {
    this.showFlashcardBack = false;
  }

  get prevCardExists() {
    return this.currentFlashcardIndex === 0 ? false : true;
  }

  get nextCardExists() {
    return this.currentFlashcardIndex + 1 === this.flashcardsToStudy.length
      ? false
      : true;
  }

  private changeComfortLevel() {
    if (this.currentFlashcard) {
      try {
        this.$apollo.mutate({
          mutation: CHANGE_FLASHCARD_COMFORT_LEVEL,
          variables: {
            id: this.currentFlashcard.id,
            comfortLevel: this.currentFlashcard.comfortLevel
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  private goToNextFlashcard() {
    this.changeComfortLevel();
    this.currentFlashcardIndex += 1;
  }

  private goToPrevFlashcard() {
    this.changeComfortLevel();
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
