import gql from "graphql-tag";

export default gql`
  query MyDecks {
    me {
      id
      decks {
        id
        name
        description
        flashcards {
          id
        }
      }
    }
  }
`;
