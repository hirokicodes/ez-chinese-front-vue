<template>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
          <form @submit.prevent="handleTranslate">
            <div class="field">
              <div class="control">
                <textarea
                  class="textarea"
                  v-model="chineseText"
                  placeholder="Enter a Chinese character, word, or phrase"
                ></textarea>
              </div>
            </div>

            <div class="field">
              <button class="button" type="submit">Translate</button>
            </div>
          </form>
          <div
            class="subtitle is-4"
          >EZ Chinese is a platform to make your language learning journey easier. Simply enter Chinese text to create flashcards out of them.</div>
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
          <div class="columns is-mobile is-multiline">
            <div v-for="(hanzi, i) in hanziDataArray" :key="i" class="hanzi-text-unit">
              <HanziUnit :hanzi="hanzi" :me="me"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GET_HANZI_OBJECTS_FROM_TEXT from "@/graphql/queries/GET_HANZI_OBJECTS_FROM_TEXT";
import GET_ME from "@/graphql/queries/GET_ME";
import HanziUnit from "@/components/HanziUnit.vue";

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

@Component({
  components: {
    HanziUnit
  },
  apollo: {
    me: { query: GET_ME }
  }
})
export default class Home extends Vue {
  private chineseText: string = "";
  private hanziDataArray: Hanzi[] = [];

  private async handleTranslate() {
    const { data } = await this.$apollo.query({
      query: GET_HANZI_OBJECTS_FROM_TEXT,
      variables: {
        text: this.chineseText
      }
    });
    this.hanziDataArray = data.hanziObjectsFromText;
  }
}
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
}
</style>
