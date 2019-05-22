import gql from "graphql-tag";

export default gql`
  mutation ChangeFlashcardComfortLevel($id: ID!, $comfortLevel: Int!) {
    changeFlashcardComfortLevel(id: $id, comfortLevel: $comfortLevel) {
      id
      comfortLevel
    }
  }
`;
