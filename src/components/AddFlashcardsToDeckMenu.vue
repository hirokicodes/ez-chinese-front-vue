<template>
  <div class="box">
    <div class="title">Your decks</div>
    <template v-if="me">
      <div v-for="(deck, i) in me.decks" :key="i" class="level deck-info">
        <div class="level-left">
          <router-link :to="`/deck/${deck.id}`">{{deck.name}}</router-link>
          <input type="checkbox" :id="deck.id" :value="deck" v-model="myDecks">
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
import ADD_FLASHCARDS_TO_DECK from "@/graphql/mutations/deck/ADD_FLASHCARDS_TO_DECK";
import { Types } from "@/types/types";

@Component({
  apollo: {
    me: {
      query: GET_MY_DECKS
    }
  }
})
export default class AddFlashcardsToDeckMenu extends Vue {
  @Prop() readonly flashcards!: Types.Flashcard[];

  private myDecks: Types.Deck[] = [];
  private me: null | Types.Me = null;

  private async addToDeck() {
    if (this.flashcards) {
      this.myDecks.forEach(async deck => {
        try {
          const { data } = await this.$apollo.mutate({
            mutation: ADD_FLASHCARDS_TO_DECK,
            variables: {
              deckId: deck.id,
              flashcardIds: (this.flashcards as Types.Flashcard[]).map(
                flashcard => flashcard.id
              )
            },
            update: (cache, { data: { addFlashcardsToDeck } }) => {
              const data = cache.readQuery({ query: GET_MY_DECKS });
              const oldDecks: Types.Deck[] = (data as any).me.decks.filter(
                (deckInArr: Types.Deck) => deckInArr.id !== deck.id
              );
              (data as any).me.decks = [...oldDecks, addFlashcardsToDeck];
              cache.writeQuery({
                query: GET_MY_DECKS,
                data
              });
            },
            optimisticResponse: {
              __typename: "Mutation",
              addFlashcardsToDeck: {
                __typename: "Deck",
                id: deck.id,
                name: deck.name,
                description: deck.description,
                flashcards: [...deck.flashcards, ...this.flashcards]
              }
            }
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
    this.myDecks = [];
    this.$emit("addToDeck");
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
