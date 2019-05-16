import gql from "graphql-tag";

export default gql`
  query MyFlashcards {
    me {
      id
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
      decks {
        id
      }
    }
  }
`;
