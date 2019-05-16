import gql from "graphql-tag";

export default gql`
  mutation AddFlashcardToDeck($deckId: ID!, $flashcardId: ID!) {
    addFlashcardToDeck(deckId: $deckId, flashcardId: $flashcardId) {
      id
      flashcards {
        id
      }
    }
  }
`;
