import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";
import BracketViewer from "../../../components/tourney/bracket-viewer";
import { Tourney } from "../../../lib/api-types";
import { useTourney } from "../../../lib/client/api";
import { createBracket } from "../../../lib/client/bracket";
import loadTourneyProps from "../../../lib/client/load-tourney-props";
import { DECORATE } from "../../_app";

const Container = styled.main`
  display: flex;
  justify-content: center;
  overflow-x: auto;
`;

export interface TourneyProps {
  tourney: Tourney;
}

const BracketView = ({ tourney }: TourneyProps) => (
  <Container>
    <Content tourney={tourney} />
  </Container>
);

export default BracketView;

const Content = ({ tourney: fallback }: TourneyProps) => {
  const [tourney, _tourneyUpdater, apiResponse] = useTourney(fallback);

  const router = useRouter();
  if (apiResponse?.code === 404) {
    router.replace("/");
  }

  const bracket = useMemo(() => createBracket(tourney), [tourney]);

  return bracket === null ? null : (
    <BracketViewer bracket={bracket} tourney={tourney} tourneyUpdater={null} />
  );
};

export const getServerSideProps: GetServerSideProps<TourneyProps> = async (
  ctx
) => {
  const result = await loadTourneyProps(false)(ctx);

  if ("props" in result) {
    return { props: { ...result.props, [DECORATE]: false } };
  }

  return result;
};
