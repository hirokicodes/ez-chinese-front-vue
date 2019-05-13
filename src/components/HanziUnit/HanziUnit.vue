<template>
  <div class="hanzi-text">
    <div class="hanzi-text-popover">
      <div>{{`${hanzi.traditional}/${hanzi.simplified}`}}</div>
      <div>{{`${hanzi.pinyinDiacritic}/${hanzi.pinyinNumeric}`}}</div>
      <div>{{hanzi.definitions}}</div>
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
    <div class="hanzi-text-unit">
      <p>{{hanzi.pinyinDiacritic}}</p>
      <p class="is-size-2">{{hanzi.simplified}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";

import HanziUnitMixin from "@/mixins/hanziUnitMixin.ts";

@Component
export default class HanziUnit extends mixins(HanziUnitMixin) {}
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
