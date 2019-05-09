import gql from "graphql-tag";

export default gql`
  query MyBookmarkedHanzis {
    me {
      id
      bookmarkedHanzis {
        id
        simplified
        traditional
        definitions
        definitionsDiacritic
        pinyinDiacritic
        pinyinNumeric
        referencedSimplified
        referencedTraditional
      }
    }
  }
`;
