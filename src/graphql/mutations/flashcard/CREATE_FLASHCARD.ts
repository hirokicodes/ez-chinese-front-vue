import gql from "graphql-tag";

export default gql`
  mutation CreateFlashcard($id: ID!, $comfortLevel: Int) {
    createFlashcard(id: $id, comfortLevel: $comfortLevel) {
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
