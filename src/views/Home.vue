<template>
  <div class="home">
    <div>Welcome to EZ Chinese</div>
    <form @submit.prevent="handleTranslate">
      <div class="field">
        <label class="label">Chinese Text</label>
        <div class="control">
          <textarea class="textarea" v-model="chineseText" placeholder="Textarea"></textarea>
        </div>
      </div>

      <div class="field">
        <button class="button" type="submit">Translate</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GET_HANZIS_IN_TEXT from "@/graphql/queries/GET_HANZIS_IN_TEXT";

@Component
export default class Home extends Vue {
  private chineseText: String = "";

  private async handleTranslate() {
    console.log("handle translate");
    const uniqueString = this.uniqueString();
    const { data } = await this.$apollo.query({
      query: GET_HANZIS_IN_TEXT,
      variables: {
        text: uniqueString
      }
    });

    console.log("data", data);
  }

  public uniqueString(): String {
    const originalText = this.chineseText;
    let newText: String = "";
    for (let i = 0; i < originalText.length; i++) {
      if (newText.indexOf(originalText.charAt(i)) == -1) {
        newText += originalText[i];
      }
    }
    console.log("newText", newText);
    return newText;
  }
}
</script>
