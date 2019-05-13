// import { Vue, Prop } from "vue-property-decorator";
// import Component from "vue-class-component";
// import BOOKMARK_HANZI from "@/graphql/mutations/user/BOOKMARK_HANZI";
// import UNBOOKMARK_HANZI from "@/graphql/mutations/user/UNBOOKMARK_HANZI";
// import GET_ME from "@/graphql/queries/GET_ME";

// interface Hanzi {
//   id: string;
//   simplified: string;
//   traditional: string;
//   definitions: string;
//   definitionsDiacritic: string;
//   pinyinDiacritic: string;
//   pinyinNumeric: string;
//   referencedSimplified: string | null;
//   referencedTraditional: string | null;
// }

// interface Me {
//   id: String;
//   username: String;
//   email: String;
//   bookmarkedHanzis: Hanzi[];
// }

// @Component
// export default class HanziUnitMixin extends Vue {
//   @Prop() readonly hanzi!: Hanzi;
//   @Prop() readonly me?: Me;

//   private isBookmarkButtonHovered: boolean = false;

//   get isBookmarked() {
//     if (this.me) {
//       return (this.me as any).bookmarkedHanzis.some(
//         (hanzi: Hanzi) => hanzi.id === this.hanzi.id
//       );
//     }
//   }

//   private setIsBookmarkButtonHovered() {
//     this.isBookmarkButtonHovered = !this.isBookmarkButtonHovered;
//   }

//   private handleClickBookmarkButton() {
//     if (this.me) {
//       this.isBookmarked
//         ? this.handleUnbookmarkHanzi()
//         : this.handleBookmarkHanzi();
//     } else {
//       console.log("not logged in");
//     }
//   }

//   private async handleBookmarkHanzi() {
//     if (this.$store.state.loggedIn) {
//       try {
//         const { data } = await this.$apollo.mutate({
//           mutation: BOOKMARK_HANZI,
//           variables: {
//             id: this.hanzi.id
//           },
//           update: (cache, { data: { bookmarkHanzi } }) => {
//             const data = cache.readQuery({ query: GET_ME });
//             (data as any).me.bookmarkedHanzis = bookmarkHanzi.bookmarkedHanzis;
//             cache.writeQuery({
//               query: GET_ME,
//               data
//             });
//           },
//           optimisticResponse: {
//             __typename: "Mutation",
//             bookmarkHanzi: {
//               __typename: "User",
//               id: (this.me as Me).id,
//               bookmarkedHanzis: [
//                 ...(this.me as Me).bookmarkedHanzis,
//                 { id: this.hanzi.id, __typename: "Hanzi" }
//               ]
//             }
//           }
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }

//   private async handleUnbookmarkHanzi() {
//     if (this.$store.state.loggedIn) {
//       try {
//         const { data } = await this.$apollo.mutate({
//           mutation: UNBOOKMARK_HANZI,
//           variables: {
//             id: this.hanzi.id
//           },
//           update: (cache, { data: { unbookmarkHanzi } }) => {
//             const data = cache.readQuery({ query: GET_ME });
//             (data as any).me.bookmarkedHanzis =
//               unbookmarkHanzi.bookmarkedHanzis;
//             cache.writeQuery({
//               query: GET_ME,
//               data
//             });
//           },
//           optimisticResponse: {
//             __typename: "Mutation",
//             unbookmarkHanzi: {
//               __typename: "User",
//               id: (this.me as Me).id,
//               bookmarkedHanzis: (this.me as Me).bookmarkedHanzis.filter(
//                 (hanzi: Hanzi) => hanzi.id !== this.hanzi.id
//               )
//             }
//           }
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }

import { Vue, Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import CREATE_FLASHCARD from "@/graphql/mutations/flashcard/CREATE_FLASHCARD";
import DELETE_FLASHCARD from "@/graphql/mutations/flashcard/DELETE_FLASHCARD";
import GET_ME from "@/graphql/queries/GET_ME";

interface Hanzi {
  id: string;
  simplified: string;
  traditional: string;
  definitions: string;
  definitionsDiacritic: string;
  pinyinDiacritic: string;
  pinyinNumeric: string;
  referencedSimplified: string | null;
  referencedTraditional: string | null;
}

interface Flashcard {
  id: string;
  hanzi: Hanzi;
  comfortLevel: number;
  updatedAt: string;
  createdAt: string;
}

interface Me {
  id: String;
  username: String;
  email: String;
  flashcards: Flashcard[];
}

@Component
export default class HanziUnitMixin extends Vue {
  @Prop() readonly hanzi!: Hanzi;
  @Prop() readonly me?: Me;

  private isSaveButtonHovered: boolean = false;

  get isSaved() {
    if (this.me) {
      return (this.me as Me).flashcards.some(
        (flashcard: Flashcard) => flashcard.hanzi.id === this.hanzi.id
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
      const flashcard = (this.me as Me).flashcards.find(
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
                (flashcard: Flashcard) => flashcard.id !== deleteFlashcard.id
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
