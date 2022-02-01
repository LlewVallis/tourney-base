import { MatchResult, Participant, Tourney } from "../api-types";

export interface Bracket {
  tourney: Tourney;
  rounds: Round[];
  danglingMatchResults: MatchResult[];
}

export interface Round {
  matches: (Match | null)[];
}

export type MatchState = "first-wins" | "second-wins" | "pending";

export interface Match {
  result: MatchResult | null;
  firstParticipant: Participant | null;
  secondParticipant: Participant | null;
  firstPredecessor: Match | null;
  secondPredecessor: Match | null;
  successor: Match | null;
}

export function createBracket(tourney: Tourney): Bracket | null {
  if (tourney.participants.length < 2) return null;

  const bracket = structureRounds(tourney);
  linkMatches(bracket);
  populateParticipants(bracket);
  applyMatchResults(bracket);

  return bracket;
}

function structureRounds(tourney: Tourney): Bracket {
  const rounds: Round[] = [];

  let participants = 1;
  while (participants < previousPowerOfTwo(tourney.participants.length)) {
    rounds.push(structureRound(participants));
    participants *= 2;
  }

  if (participants < tourney.participants.length) {
    const excess = tourney.participants.length - participants;
    rounds.push(structureRound(excess, participants));
  }

  rounds.reverse();

  return { tourney, rounds, danglingMatchResults: [...tourney.matchResults] };
}

function structureRound(
  matchCount: number,
  slotCount: number = matchCount
): Round {
  if (matchCount > slotCount || slotCount !== nextPowerOfTwo(slotCount)) {
    throw new Error();
  }

  const matches: (Match | null)[] = Array.from(
    { length: slotCount },
    () => null
  );

  const indices = [
    ...Array.from({ length: Math.ceil(slotCount / 2) }, (_, i) => i * 2),
    ...Array.from({ length: Math.floor(slotCount / 2) }, (_, i) => i * 2 + 1),
  ];

  let matchesToAdd = matchCount;
  for (const i of indices) {
    if (matchesToAdd === 0) {
      break;
    }

    matches[i] = {
      result: null,
      firstParticipant: null,
      secondParticipant: null,
      firstPredecessor: null,
      secondPredecessor: null,
      successor: null,
    };

    matchesToAdd--;
  }

  return { matches };
}

function linkMatches({ rounds }: Bracket): void {
  for (const [roundIndex, round] of rounds.entries()) {
    if (roundIndex === 0) continue;
    const lastRound = rounds[roundIndex - 1];

    for (const [matchIndex, match] of round.matches.entries()) {
      const firstPred = lastRound.matches[matchIndex * 2];
      const secondPred = lastRound.matches[matchIndex * 2 + 1];

      if (firstPred !== null) firstPred.successor = match;
      if (secondPred !== null) secondPred.successor = match;

      if (match !== null) {
        match.firstPredecessor = firstPred;
        match.secondPredecessor = secondPred;
      }
    }
  }
}

function populateParticipants({ tourney, rounds }: Bracket): void {
  const participants = [...tourney.participants].reverse();

  for (const round of rounds) {
    for (const match of round.matches) {
      if (match === null) {
        continue;
      }

      if (match.firstPredecessor === null) {
        match.firstParticipant = participants.pop()!!;
      }

      if (participants.length === 0) return;

      if (match.secondPredecessor === null) {
        match.secondParticipant = participants.pop()!!;
      }

      if (participants.length === 0) return;
    }
  }
}

function applyMatchResults({
  rounds,
  danglingMatchResults: matchResults,
}: Bracket): void {
  for (const round of rounds) {
    for (const match of round.matches) {
      if (match === null) continue;

      const propogateWinner = (
        predecessor: Match | null,
        setParticipant: (participant: Participant) => void
      ) => {
        if (predecessor !== null && predecessor.result !== null) {
          const winner = predecessor.result.winner;

          if (predecessor.firstParticipant!!.id === winner) {
            setParticipant(predecessor.firstParticipant!!);
          }

          if (predecessor.secondParticipant!!.id === winner) {
            setParticipant(predecessor.secondParticipant!!);
          }
        }
      };

      propogateWinner(
        match.firstPredecessor,
        (participant) => (match.firstParticipant = participant)
      );

      propogateWinner(
        match.secondPredecessor,
        (participant) => (match.secondParticipant = participant)
      );

      if (
        match.firstParticipant === null ||
        match.secondParticipant === null ||
        match.result !== null
      ) {
        continue;
      }

      for (const [i, result] of matchResults.entries()) {
        if (
          (result.winner === match.firstParticipant.id &&
            result.loser === match.secondParticipant.id) ||
          (result.winner === match.secondParticipant.id &&
            result.loser === match.firstParticipant.id)
        ) {
          match.result = result;
          matchResults.splice(i, 1);
          break;
        }
      }
    }
  }
}

function nextPowerOfTwo(value: number): number {
  if (value < 1) {
    throw new Error();
  }

  let result = 1;

  while (result < value) {
    result *= 2;
  }

  return result;
}

function previousPowerOfTwo(value: number): number {
  const next = nextPowerOfTwo(value);
  if (next > value) {
    return next / 2;
  } else {
    return next;
  }
}
