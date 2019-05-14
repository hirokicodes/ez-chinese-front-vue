import gql from "graphql-tag";

export default gql`
  query Deck($id: ID!) {
    deck(id: $id) {
      id
      name
      description
      flashcards {
        id
        hanzi {
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
  }
`;
