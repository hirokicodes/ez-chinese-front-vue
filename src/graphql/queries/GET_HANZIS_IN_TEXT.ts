import gql from "graphql-tag";

export default gql`
  query HanzisInText($text: String!) {
    hanzisInText(text: $text) {
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
