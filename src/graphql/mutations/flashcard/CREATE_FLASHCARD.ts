import gql from "graphql-tag";

export default gql`
  mutation CreateFlashcard($id: ID!) {
    createFlashcard(id: $id) {
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
`;
