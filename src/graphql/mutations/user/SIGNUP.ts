import gql from "graphql-tag";

export default gql`
  mutation Signup($data: SignupUserInput!) {
    signup(data: $data) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;
