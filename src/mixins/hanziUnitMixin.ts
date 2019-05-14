import { Vue, Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import CREATE_FLASHCARD from "@/graphql/mutations/flashcard/CREATE_FLASHCARD";
import DELETE_FLASHCARD from "@/graphql/mutations/flashcard/DELETE_FLASHCARD";
import GET_ME from "@/graphql/queries/GET_ME";
import { Types } from "@/types/types";

@Component
export default class HanziUnitMixin extends Vue {
  @Prop() readonly hanzi!: Types.Hanzi;
  @Prop() readonly me?: Types.Me;

  private isSaveButtonHovered: boolean = false;

  get isSaved() {
    if (this.me) {
      return (this.me as Types.Me).flashcards.some(
        (flashcard: Types.Flashcard) => flashcard.hanzi.id === this.hanzi.id
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
    if (this.$store.state.loggedIn) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: CREATE_FLASHCARD,
          variables: {
            id: this.hanzi.id
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
              hanzi: this.hanzi
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  private async handleDeleteHanziAsFlashcard() {
    if (this.$store.state.loggedIn) {
      const flashcard = (this.me as Types.Me).flashcards.find(
        flashcard => flashcard.hanzi.id === this.hanzi.id
      );
      if (flashcard) {
        try {
          this.$apollo.mutate({
            mutation: DELETE_FLASHCARD,
            variables: {
              id: flashcard.id
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
                id: flashcard.id
              }
            }
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log("flashcard doesnte exist");
      }
    }
  }
}
