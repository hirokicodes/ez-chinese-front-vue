import gql from "graphql-tag";

export default gql`
  mutation AddFlashcardsToDeck($deckId: ID!, $flashcardIds: [ID!]!) {
    addFlashcardsToDeck(deckId: $deckId, flashcardIds: $flashcardIds) {
      id
      name
      description
      flashcards {
        id
      }
    }
  }
`;
