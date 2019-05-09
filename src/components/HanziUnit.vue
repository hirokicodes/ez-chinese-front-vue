<template>
  <div class="hanzi-text">
    <div class="hanzi-text-popover">
      <div>{{`${hanzi.traditional}/${hanzi.simplified}`}}</div>
      <div>{{`${hanzi.pinyinDiacritic}/${hanzi.pinyinNumeric}`}}</div>
      <div>{{hanzi.definitions}}</div>
      <button class="button is-small has-text-info">
        <i class="fas fa-bookmark"></i>
      </button>
    </div>
    <div class="hanzi-text-unit" @mouseenter="setIsHovered" @mouseleave="setIsHovered">
      <p>{{hanzi.pinyinDiacritic}}</p>
      <p class="is-size-2">{{hanzi.simplified}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import GET_HANZI_OBJECTS_FROM_TEXT from "@/graphql/queries/GET_HANZI_OBJECTS_FROM_TEXT";

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

@Component
export default class HanziUnit extends Vue {
  @Prop() readonly hanzi!: Hanzi;

  private isHovered: boolean = false;

  private setIsHovered(): void {
    this.isHovered = !this.isHovered;
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
