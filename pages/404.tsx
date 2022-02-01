import Link from "next/link";
import CenterParagraph from "../components/center-paragraph";
import { Heading } from "../components/heading";
import SimpleLayout from "../components/simple-layout";

const NotFound = () => (
  <SimpleLayout>
    <Heading content="Page not found" />
    <CenterParagraph>
      The page you navigated to does not exist, click{" "}
      <Link href="/">
        <a>here</a>
      </Link>{" "}
      to go home.
    </CenterParagraph>
  </SimpleLayout>
);

export default NotFound;
