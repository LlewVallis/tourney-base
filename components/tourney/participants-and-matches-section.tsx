import styled from "styled-components";
import { Tourney } from "../../lib/api-types";
import { ApiUpdater } from "../../lib/client/api";
import { Bracket } from "../../lib/client/bracket";
import MatchesList from "./matches-list";
import ParticipantsList from "./participants-list";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
`;

const Column = styled.div`
  overflow: hidden;
`;

const Heading = styled.h2`
  text-align: center;
`;

const ParticipantAndMatchesSection = ({
  bracket,
  tourney,
  tourneyUpdater,
}: {
  bracket: Bracket | null;
  tourney: Tourney;
  tourneyUpdater: ApiUpdater<Tourney> | null;
}) => (
  <Container>
    <Column>
      <Heading>Participants</Heading>

      <ParticipantsList tourney={tourney} tourneyUpdater={tourneyUpdater} />
    </Column>
    <Column>
      <Heading>Matches</Heading>

      <MatchesList
        bracket={bracket}
        tourney={tourney}
        tourneyUpdater={tourneyUpdater}
      />
    </Column>
  </Container>
);

export default ParticipantAndMatchesSection;
