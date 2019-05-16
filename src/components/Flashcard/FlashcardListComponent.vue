<template>
  <div class="box">
    <div class="media">
      <div class="media-left">{{flashcard.hanzi.simplified}}</div>
      <div class="media-content">
        <div class="content">{{flashcard.hanzi.definitions}}</div>
      </div>
      <div class="media-right">
        <button class="button is-small" @click="openAddFlashcardMenu">
          <i class="fas fa-plus"></i>
        </button>
        <button class="button is-small">
          <i class="fas fa-bookmark"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import CREATE_FLASHCARD from "@/graphql/mutations/flashcard/CREATE_FLASHCARD";
import DELETE_FLASHCARD from "@/graphql/mutations/flashcard/DELETE_FLASHCARD";
import GET_ME from "@/graphql/queries/GET_ME";
import { Types } from "@/types/types";

import HanziUnitMixin from "@/mixins/hanziUnitMixin.ts";

@Component
export default class FlashcardListComponent extends Vue {
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

  @Emit("showAddFlashcardMenu")
  private openAddFlashcardMenu() {
    return this.flashcard;
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
