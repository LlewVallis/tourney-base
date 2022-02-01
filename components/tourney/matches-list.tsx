import React, { useMemo, useRef, useState } from "react";
import { IoMdTrophy } from "react-icons/io";
import { IoSkullSharp } from "react-icons/io5";
import { MdDelete, MdSwapVert } from "react-icons/md";
import { toast } from "react-toastify";
import styled from "styled-components";
import { MatchResult, Tourney } from "../../lib/api-types";
import {
  ApiUpdater,
  createMatchResult,
  deleteMatchResult,
  updateMatchResult,
} from "../../lib/client/api";
import { Bracket } from "../../lib/client/bracket";
import { ERROR_COLOR } from "../../lib/client/theme";
import { ButtonSuccess } from "../button";
import Select, { SelectHandle } from "../select";
import Card, { CardButton, CardContent } from "./card";

const MatchesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MatchesList = ({
  bracket,
  tourney,
  tourneyUpdater,
}: {
  bracket: Bracket | null;
  tourney: Tourney;
  tourneyUpdater: ApiUpdater<Tourney> | null;
}) => {
  const matches = buildRichMatches(bracket, tourney);

  if (matches.length === 0 && tourneyUpdater === null) {
    return <p>No matches have been recorded yet.</p>;
  }

  if (tourney.participants.length < 2) {
    return <p>Add at least two participants to start recording matches.</p>;
  }

  return (
    <>
      {tourneyUpdater === null ? null : (
        <AddMatchControls tourney={tourney} tourneyUpdater={tourneyUpdater} />
      )}

      <MatchesContainer>
        {matches.map((match) => (
          <Match
            key={match.result.id}
            match={match}
            tourney={tourney}
            tourneyUpdater={tourneyUpdater}
          />
        ))}
      </MatchesContainer>
    </>
  );
};

export default MatchesList;

interface RichMatch {
  result: MatchResult;
  dangling: boolean;
}

function buildRichMatches(
  bracket: Bracket | null,
  tourney: Tourney
): RichMatch[] {
  if (bracket === null) {
    return tourney.matchResults.map((result) => ({ result, dangling: true }));
  }

  const integrated = bracket.rounds
    .flatMap((round) => round.matches)
    .flatMap((match) => {
      if (match === null || match.result === null) {
        return [];
      } else {
        return [{ result: match.result, dangling: false }];
      }
    });

  const dangling = bracket.danglingMatchResults.map((result) => ({
    result,
    dangling: true,
  }));

  return [...integrated, ...dangling];
}

const ErrorCard = styled(Card)`
  border-left: 0.25rem solid ${ERROR_COLOR};
`;

const Match = ({
  match,
  tourney,
  tourneyUpdater,
}: {
  match: RichMatch;
  tourney: Tourney;
  tourneyUpdater: ApiUpdater<Tourney> | null;
}) =>
  match.dangling ? (
    <ErrorCard>
      <MatchContent
        match={match}
        tourney={tourney}
        tourneyUpdater={tourneyUpdater}
      />
    </ErrorCard>
  ) : (
    <Card>
      <MatchContent
        match={match}
        tourney={tourney}
        tourneyUpdater={tourneyUpdater}
      />
    </Card>
  );

const NamesContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 0.5rem;
`;

const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.125rem 0;
`;

const MatchButtonsContainer = styled.div`
  font-size: 150%;
`;

const MatchContent = ({
  match,
  tourney,
  tourneyUpdater,
}: {
  match: RichMatch;
  tourney: Tourney;
  tourneyUpdater: ApiUpdater<Tourney> | null;
}) => {
  const nameMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const participant of tourney.participants) {
      map.set(participant.id, participant.name);
    }

    return map;
  }, [tourney.participants]);

  const winnerName = nameMap.get(match.result.winner) ?? "Unknown";
  const loserName = nameMap.get(match.result.loser) ?? "Unknown";

  const [processing, setProcessing] = useState(false);

  return (
    <>
      <CardContent>
        <NamesContainer>
          <IoMdTrophy />
          <Name>{winnerName}</Name>
          <IoSkullSharp />
          <Name>{loserName}</Name>
        </NamesContainer>
      </CardContent>

      {tourneyUpdater === null ? null : (
        <MatchButtonsContainer>
          <CardButton
            onClick={async () => {
              if (processing) return;
              setProcessing(true);

              const result = await updateMatchResult(
                tourney.id,
                match.result.id,
                {
                  winner: match.result.loser,
                  loser: match.result.winner,
                }
              );

              if (result.data === null) {
                console.error(result);
                toast.error("Could not update match");
                tourneyUpdater.revalidate();
              } else {
                tourneyUpdater(result.data.tourney);
              }

              setProcessing(false);
            }}
          >
            <MdSwapVert />
          </CardButton>

          <CardButton
            onClick={async () => {
              if (processing) return;
              setProcessing(true);

              const result = await deleteMatchResult(
                tourney.id,
                match.result.id
              );
              if (result.data === null) {
                console.error(result);
                toast.error("Could not delete match");
                tourneyUpdater.revalidate();
              } else {
                tourneyUpdater(result.data.tourney);
              }

              setProcessing(false);
            }}
          >
            <MdDelete />
          </CardButton>
        </MatchButtonsContainer>
      )}
    </>
  );
};

const AddMatchControlsContainer = styled.form`
  display: flex;
  margin: 1rem 0;
  gap: 1.5rem;
`;

const AddMatchControls = ({
  tourney,
  tourneyUpdater,
}: {
  tourney: Tourney;
  tourneyUpdater: ApiUpdater<Tourney>;
}) => {
  const winnerRef = useRef<SelectHandle>(null);
  const loserRef = useRef<SelectHandle>(null);

  const [winner, setWinner] = useState<string | null>(null);
  const [loser, setLoser] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);

  const options = useMemo(
    () =>
      tourney.participants.map((participant) => ({
        value: participant.id,
        label: participant.name,
      })),
    [tourney.participants]
  );

  return (
    <AddMatchControlsContainer
      onSubmit={async (e) => {
        e.preventDefault();

        if (
          processing ||
          winner === null ||
          loser === null ||
          winner === loser
        ) {
          return;
        }

        setProcessing(true);
        winnerRef.current?.clear();
        loserRef.current?.clear();

        const result = await createMatchResult(tourney.id, {
          winner: winner!!,
          loser: loser!!,
        });

        if (result.data === null) {
          console.error(result);
          toast.error("Could not record match");
        } else {
          tourneyUpdater(result.data.tourney);
        }

        setProcessing(false);
      }}
    >
      <Select
        ref={winnerRef}
        onChange={setWinner}
        placeholder="Winner"
        noOptionsMessage="No participants"
        options={options}
      />

      <Select
        ref={loserRef}
        onChange={setLoser}
        placeholder="Loser"
        noOptionsMessage="No participants"
        options={options}
      />

      <ButtonSuccess type="submit" disabled={processing}>
        Record
      </ButtonSuccess>
    </AddMatchControlsContainer>
  );
};
