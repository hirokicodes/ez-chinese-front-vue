import gql from "graphql-tag";

export default gql`
  query HanziObjectsFromText($text: String!) {
    hanziObjectsFromText(text: $text) {
      id
      simplified
      traditional
      referencedSimplified
      referencedTraditional
      pinyinNumeric
      pinyinDiacritic
      definitions
      definitionsDiacritic
    }
  }
`;
