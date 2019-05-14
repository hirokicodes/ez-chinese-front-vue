<template>
  <div class="box">
    <p>{{flashcard.hanzi.pinyinDiacritic}}</p>
    <p class="is-size-2">{{flashcard.hanzi.simplified}}</p>
    <div class="hanzi-definitions">
      <p>{{flashcard.hanzi.definitions}}</p>
    </div>
    <div class="level">
      <div class="level-left">
        <button
          class="button is-small"
          :class="{'has-text-info': !isSaved, 'has-text-success': isSaved && !isSaveButtonHovered, 'has-text-danger': isSaved && isSaveButtonHovered}"
          @click="handleClickSaveButton"
          @mouseover="setIsSaveButtonHovered"
          @mouseout="setIsSaveButtonHovered"
        >
          <i
            :class="{'fas fa-bookmark': !isSaved, 'fas fa-check': isSaved && !isSaveButtonHovered, 'fas fa-times': isSaved && isSaveButtonHovered}"
          ></i>
        </button>
      </div>
      <div class="level-right">right</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import CREATE_FLASHCARD from "@/graphql/mutations/flashcard/CREATE_FLASHCARD";
import DELETE_FLASHCARD from "@/graphql/mutations/flashcard/DELETE_FLASHCARD";
import GET_ME from "@/graphql/queries/GET_ME";
import { Types } from "@/types/types";

import HanziUnitMixin from "@/mixins/hanziUnitMixin.ts";

@Component
export default class FlashcardTile extends Vue {
  @Prop() readonly flashcard!: Types.Flashcard;
  @Prop() readonly me?: Types.Me;

  private isSaveButtonHovered: boolean = false;

  get isSaved() {
    if (this.me) {
      return (this.me as Types.Me).flashcards.some(
        (flashcard: Types.Flashcard) =>
          flashcard.hanzi.id === this.flashcard.hanzi.id
      );
    }
  }

  private setIsSaveButtonHovered() {
    this.isSaveButtonHovered = !this.isSaveButtonHovered;
  }

  private handleClickSaveButton() {
    if (this.me) {
      this.isSaved
        ? this.handleDeleteHanziAsFlashcard()
        : this.handleSaveHanziAsFlashcard();
    } else {
      console.log("not logged in");
    }
  }

  private async handleSaveHanziAsFlashcard() {
    console.log("save flashcard");
    if (this.$store.state.loggedIn) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: CREATE_FLASHCARD,
          variables: {
            id: this.flashcard.hanzi.id,
            comfortLevel: this.flashcard.comfortLevel
          },
          update: (cache, { data: { createFlashcard } }) => {
            const data = cache.readQuery({ query: GET_ME });
            (data as any).me.flashcards.push(createFlashcard);
            cache.writeQuery({
              query: GET_ME,
              data
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            createFlashcard: {
              __typename: "Flashcard",
              id: -1,
              hanzi: this.flashcard.hanzi
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  private async handleDeleteHanziAsFlashcard() {
    console.log("delete flashcard");
    if (this.$store.state.loggedIn) {
      try {
        this.$apollo.mutate({
          mutation: DELETE_FLASHCARD,
          variables: {
            id: this.flashcard.id
          },
          update: (cache, { data: { deleteFlashcard } }) => {
            const data = cache.readQuery({ query: GET_ME });
            (data as any).me.flashcards = (data as any).me.flashcards.filter(
              (flashcard: Types.Flashcard) =>
                flashcard.id !== deleteFlashcard.id
            );
            cache.writeQuery({
              query: GET_ME,
              data
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            deleteFlashcard: {
              __typename: "Flashcard",
              id: this.flashcard.id
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  height: 300px;
  // position: relative;
}

.hanzi-definitions {
  // position: absolute;
  // bottom: 0px;
  height: 150px;
  overflow: auto;
  word-break: break-word;
}
</style>
