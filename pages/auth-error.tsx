import Link from "next/link";
import CenterParagraph from "../components/center-paragraph";
import { Heading } from "../components/heading";
import SimpleLayout from "../components/simple-layout";

const AuthError = () => (
  <SimpleLayout>
    <Heading content={"Authentication error"} />
    <CenterParagraph>
      There was an error attemping to sign in. Click{" "}
      <Link href="/">
        <a>here</a>
      </Link>{" "}
      to go home.
    </CenterParagraph>
  </SimpleLayout>
);

export default AuthError;
