<template>
  <div class="box">
    <p>{{hanzi.pinyinDiacritic}}</p>
    <p class="is-size-2">{{hanzi.simplified}}</p>
    <div class="hanzi-definitions">
      <p>{{hanzi.definitions}}</p>
    </div>
    <div class="level">
      <div class="level-left">
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
      <div class="level-right">right</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";

import HanziUnitMixin from "@/mixins/hanziUnitMixin.ts";

@Component
export default class HanziTile extends mixins(HanziUnitMixin) {}
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
