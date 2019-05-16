<template>
  <div class="box">
    <div class="title">{{flashcard.hanzi.simplified}}</div>
    <div class="title">Your decks</div>
    <template v-if="me">
      <div v-for="(deck, i) in me.decks" :key="i" class="level deck-info">
        <div class="level-left">
          <router-link :to="`/deck/${deck.id}`">{{deck.name}}</router-link>
          <input
            type="checkbox"
            :disabled="decksThatContainThisFlashcard.some(arrdeck => arrdeck.id === deck.id)"
            :id="deck.id"
            :value="deck"
            v-model="myDecks"
          >
        </div>
        <div class="level-right">Number of cards</div>
      </div>
    </template>

    <button class="button" @click="addToDeck">Add to deck(s)</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import GET_MY_DECKS from "@/graphql/queries/GET_MY_DECKS";
import ADD_FLASHCARD_TO_DECK from "@/graphql/mutations/deck/ADD_FLASHCARD_TO_DECK";
import { Types } from "@/types/types";

@Component({
  apollo: {
    me: {
      query: GET_MY_DECKS
    }
  }
})
export default class AddFlashcardToDeckMenu extends Vue {
  @Prop() readonly flashcard!: Types.Flashcard;

  private myDecks: Types.Deck[] = [];
  private decksThatContainThisFlashcard: Types.Deck[] = [];
  private me: null | Types.Me = null;

  @Watch("me")
  onMeChange() {
    if (this.me) {
      this.myDecks = this.me.decks.filter(deck =>
        deck.flashcards.some(flashcard => flashcard.id === this.flashcard.id)
      );
      this.decksThatContainThisFlashcard = this.myDecks;
    }
  }

  private async addToDeck() {
    if (this.flashcard) {
      this.myDecks.forEach(async deck => {
        try {
          const { data } = await this.$apollo.mutate({
            mutation: ADD_FLASHCARD_TO_DECK,
            variables: {
              deckId: deck.id,
              flashcardId: (this.flashcard as Types.Flashcard).id
            },
            update: (cache, { data: { addFlashcardToDeck } }) => {
              const data = cache.readQuery({ query: GET_MY_DECKS });
              const oldDecks: Types.Deck[] = (data as any).me.decks.filter(
                (deckInArr: Types.Deck) => deckInArr.id !== deck.id
              );
              (data as any).me.decks = [...oldDecks, addFlashcardToDeck];
              cache.writeQuery({
                query: GET_MY_DECKS,
                data
              });
            },
            optimisticResponse: {
              __typename: "Mutation",
              addFlashcardToDeck: {
                __typename: "Deck",
                id: deck.id,
                name: deck.name,
                description: deck.description,
                flashcards: [...deck.flashcards, this.flashcard]
              }
            }
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.deck-info {
  // background-color: #fafafa;
  &:hover {
    background-color: #fafafa;
  }
}
</style>
