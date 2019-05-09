import gql from "graphql-tag";

export default gql`
  mutation UnbookmarkHanzi($id: ID!) {
    unbookmarkHanzi(id: $id) {
      id
      bookmarkedHanzis {
        id
      }
    }
  }
`;
