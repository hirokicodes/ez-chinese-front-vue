import gql from "graphql-tag";

export default gql`
  mutation BookmarkHanzi($id: ID!) {
    bookmarkHanzi(id: $id) {
      id
      bookmarkedHanzis {
        id
      }
    }
  }
`;
