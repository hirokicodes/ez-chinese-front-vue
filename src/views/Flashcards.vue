<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-10 is-offset-1">
          <div class="level">
            <div class="level-left">
              <div class="title has-text-centered">Flashcards</div>
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
              <div v-for="(flashcard, i) in flashCardsToShow" :key="i">
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
                <div
                  v-for="(flashcard, i) in flashCardsToShow"
                  :key="i"
                  class="column is-one-quarter-desktop is-one-quarter-tablet is-half-mobile"
                >
                  <FlashcardTile :flashcard="flashcard" :me="me"/>
                </div>
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
import GET_MY_FLASHCARDS from "../graphql/queries/GET_MY_FLASHCARDS";
import FlashcardTile from "@/components/Flashcard/FlashcardTile.vue";

enum DisplayType {
  List,
  Grid
}

@Component({
  components: {
    FlashcardTile
  },
  apollo: {
    me: { query: GET_MY_FLASHCARDS }
  }
})
export default class Flashcards extends Vue {
  private displayType: DisplayType = DisplayType.List;
  private flashCardsToShow = [];

  private async created() {
    const { data } = await this.$apollo.query({
      query: GET_MY_FLASHCARDS
    });

    if (data) {
      this.flashCardsToShow = data.me.flashcards;
    }
  }

  private setDisplayTypeToList() {
    this.displayType = DisplayType.List;
  }

  private setDisplayTypeToGrid() {
    this.displayType = DisplayType.Grid;
  }
}
</script>
