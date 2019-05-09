<template>
  <div class="hanzi-text">
    <div class="hanzi-text-popover">
      <div>{{`${hanzi.traditional}/${hanzi.simplified}`}}</div>
      <div>{{`${hanzi.pinyinDiacritic}/${hanzi.pinyinNumeric}`}}</div>
      <div>{{hanzi.definitions}}</div>
      <button
        class="button is-small"
        :class="{'has-text-info': !isBookmarked, 'has-text-success': isBookmarked && !isBookmarkButtonHovered, 'has-text-danger': isBookmarked && isBookmarkButtonHovered}"
        @click="handleClickBookmarkButton"
        @mouseover="setIsBookmarkButtonHovered"
        @mouseout="setIsBookmarkButtonHovered"
      >
        <i
          :class="{'fas fa-bookmark': !isBookmarked, 'fas fa-check': isBookmarked && !isBookmarkButtonHovered, 'fas fa-times': isBookmarked && isBookmarkButtonHovered}"
        ></i>
      </button>
    </div>
    <div class="hanzi-text-unit">
      <p>{{hanzi.pinyinDiacritic}}</p>
      <p class="is-size-2">{{hanzi.simplified}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import GET_HANZI_OBJECTS_FROM_TEXT from "@/graphql/queries/GET_HANZI_OBJECTS_FROM_TEXT";
import BOOKMARK_HANZI from "@/graphql/mutations/user/BOOKMARK_HANZI";
import UNBOOKMARK_HANZI from "@/graphql/mutations/user/UNBOOKMARK_HANZI";
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

interface Me {
  id: String;
  username: String;
  email: String;
  bookmarkedHanzis: Hanzi[];
}

@Component
export default class HanziUnit extends Vue {
  @Prop() readonly hanzi!: Hanzi;
  @Prop() readonly me?: Me;

  private isBookmarkButtonHovered: boolean = false;

  get isBookmarked() {
    if (this.me) {
      return (this.me as any).bookmarkedHanzis.some(
        (hanzi: Hanzi) => hanzi.id === this.hanzi.id
      );
    }
  }

  private setIsBookmarkButtonHovered() {
    this.isBookmarkButtonHovered = !this.isBookmarkButtonHovered;
  }

  private handleClickBookmarkButton() {
    if (this.me) {
      this.isBookmarked
        ? this.handleUnbookmarkHanzi()
        : this.handleBookmarkHanzi();
    } else {
      console.log("not logged in");
    }
  }

  private async handleBookmarkHanzi() {
    if (this.$store.state.loggedIn) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: BOOKMARK_HANZI,
          variables: {
            id: this.hanzi.id
          },
          update: (cache, { data: { bookmarkHanzi } }) => {
            const data = cache.readQuery({ query: GET_ME });
            (data as any).me.bookmarkedHanzis = bookmarkHanzi.bookmarkedHanzis;
            cache.writeQuery({
              query: GET_ME,
              data
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            bookmarkHanzi: {
              __typename: "User",
              id: (this.me as any).id,
              bookmarkedHanzis: [
                ...(this.me as any).bookmarkedHanzis,
                { id: this.hanzi.id, __typename: "Hanzi" }
              ]
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  private async handleUnbookmarkHanzi() {
    if (this.$store.state.loggedIn) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: UNBOOKMARK_HANZI,
          variables: {
            id: this.hanzi.id
          },
          update: (cache, { data: { unbookmarkHanzi } }) => {
            const data = cache.readQuery({ query: GET_ME });
            (data as any).me.bookmarkedHanzis =
              unbookmarkHanzi.bookmarkedHanzis;
            cache.writeQuery({
              query: GET_ME,
              data
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            unbookmarkHanzi: {
              __typename: "User",
              id: (this.me as any).id,
              bookmarkedHanzis: (this.me as any).bookmarkedHanzis.filter(
                (hanzi: Hanzi) => hanzi.id !== this.hanzi.id
              )
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
.hanzi-text {
  position: relative;
  display: inline-block;
  &:hover {
    .hanzi-text-popover {
      visibility: visible;
    }
  }
  .hanzi-text-popover {
    visibility: hidden;
    background-color: white;
    color: black;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    border: rgb(221, 221, 221);
    border-width: 1px;
    border-style: solid;
    position: absolute;
    z-index: 1;
    width: 400px;
    bottom: 100%;
    left: 50%;
    margin-left: -200px;
  }
}

.hanzi-text-unit {
  padding-inline-start: 10px;
  padding-inline-end: 10px;
  &:hover {
    background-color: #fafafa;
  }
}
</style>
