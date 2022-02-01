import CenterParagraph from "./center-paragraph";
import { Heading } from "./heading";
import { signInWithGoogle } from "./session-manager";

const SigninSection = () => (
  <>
    <Heading content="Sign in" />
    <CenterParagraph>
      Click <a onClick={() => signInWithGoogle()}>here</a> to sign in with
      Google.
    </CenterParagraph>
  </>
);

export default SigninSection;
