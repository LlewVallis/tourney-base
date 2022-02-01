import styled from "styled-components";
import { Tourney } from "../../lib/api-types";
import { createBracket } from "../../lib/client/bracket";
import BracketViewer from "../tourney/bracket-viewer";

const Container = styled.div`
  text-align: center;
  font-size: 110%;
`;

const MockBracket = () => {
  const timestamp = new Date().toISOString();

  const tourney: Tourney = {
    id: "mock-tourney",
    ownerId: "mock-owner",
    name: "Tourney",
    created: timestamp,
    modified: timestamp,
    participants: [
      {
        id: "mock-participant-1",
        name: "Player 1",
      },
      {
        id: "mock-participant-2",
        name: "Player 2",
      },
      {
        id: "mock-participant-3",
        name: "Player 3",
      },
      {
        id: "mock-participant-4",
        name: "Player 4",
      },
    ],
    matchResults: [
      {
        id: "mock-match",
        winner: "mock-participant-1",
        loser: "mock-participant-2",
      },
    ],
  };

  const bracket = createBracket(tourney)!!;

  return (
    <Container>
      <BracketViewer
        bracket={bracket}
        tourney={tourney}
        tourneyUpdater={null}
      />
    </Container>
  );
};

export default MockBracket;
