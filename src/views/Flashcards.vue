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
                <!-- <div class="box">
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
                </div>-->
                <FlashcardListComponent
                  :flashcard="flashcard"
                  :me="me"
                  @showAddFlashcardMenu="openAddFlashcardMenu"
                />
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
    <!-- Add Flashcard to Deck(s) Menu Modal -->
    <div class="modal" :class="{ 'is-active': addFlashcardMenu}" v-if="addFlashcardMenu">
      <div class="modal-background" @click.self.stop="closeAddFlashcardMenu"></div>
      <div class="modal-content">
        <AddFlashcardToDeckMenu :flashcard="flashcardSelected"/>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click.self.stop="closeAddFlashcardMenu"
      ></button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GET_MY_FLASHCARDS from "../graphql/queries/GET_MY_FLASHCARDS";
import FlashcardTile from "@/components/Flashcard/FlashcardTile.vue";
import FlashcardListComponent from "@/components/Flashcard/FlashcardListComponent.vue";
import AddFlashcardToDeckMenu from "@/components/AddFlashcardToDeckMenu.vue";
import { Types } from "@/types/types";

enum DisplayType {
  List,
  Grid
}

@Component({
  components: {
    FlashcardTile,
    FlashcardListComponent,
    AddFlashcardToDeckMenu
  },
  apollo: {
    me: { query: GET_MY_FLASHCARDS }
  }
})
export default class Flashcards extends Vue {
  private displayType: DisplayType = DisplayType.List;
  private addFlashcardMenu: boolean = false;
  private flashCardsToShow = [];
  private flashcardSelected: null | Types.Flashcard = null;

  private async created() {
    const { data } = await this.$apollo.query({
      query: GET_MY_FLASHCARDS
    });

    if (data) {
      this.flashCardsToShow = data.me.flashcards;
    }
  }

  private openAddFlashcardMenu(flashcard: Types.Flashcard) {
    this.flashcardSelected = flashcard;
    this.addFlashcardMenu = true;
  }

  private closeAddFlashcardMenu() {
    this.addFlashcardMenu = false;
  }

  private setDisplayTypeToList() {
    this.displayType = DisplayType.List;
  }

  private setDisplayTypeToGrid() {
    this.displayType = DisplayType.Grid;
  }
}
</script>
