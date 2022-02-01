import styled from "styled-components";
import { Heading } from "../heading";
import { signInWithGoogle } from "../session-manager";
import MockBracket from "./mock-bracket";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  align-items: center;
`;

const WelcomeSection = () => (
  <>
    <Container>
      <div>
        <Heading content="Welcome to Tourney Base" />
        <p>
          Tourney Base lets you create and share tournament brackets with ease.
          Create your first tourney by{" "}
          <a onClick={() => signInWithGoogle()}>signing in with Google</a>.
        </p>
      </div>
      <MockBracket />
    </Container>
  </>
);

export default WelcomeSection;
