import gql from "graphql-tag";

export default gql`
  mutation DeleteFlashcard($id: ID!) {
    deleteFlashcard(id: $id) {
      id
    }
  }
`;
