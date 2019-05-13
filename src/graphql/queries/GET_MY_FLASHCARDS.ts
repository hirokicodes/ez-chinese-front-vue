import gql from "graphql-tag";

export default gql`
  query MyFlashcards {
    me {
      id
      flashcards {
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
