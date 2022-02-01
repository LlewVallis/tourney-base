import { GetServerSideProps } from "next";
import Link from "next/link";
import CenterParagraph from "../components/center-paragraph";
import { Heading } from "../components/heading";
import SimpleLayout from "../components/simple-layout";

interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => (
  <SimpleLayout>
    <Heading content={message} />
    <CenterParagraph>
      There was an unexpected error, click{" "}
      <Link href="/">
        <a>here</a>
      </Link>{" "}
      to go home.
    </CenterParagraph>
  </SimpleLayout>
);

export default Error;

export const getServerSideProps: GetServerSideProps<ErrorProps> = async (
  ctx
) => {
  const status = ctx.req.statusMessage?.toLowerCase();

  return {
    props: {
      message: status === undefined ? "Unknown error" : `Error - ${status}`,
    },
  };
};
