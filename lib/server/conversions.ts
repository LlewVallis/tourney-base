import {
  MatchResult as DbMatchResult,
  Participant as DbParticipant,
} from "@prisma/client";
import {
  MatchResult as ApiMatchResult,
  Participant as ApiParticipant,
  Tourney as ApiTourney,
} from "../api-types";
import { fetchTourney } from "./db";

export type RichDbTourney = Exclude<
  Awaited<ReturnType<typeof fetchTourney>>,
  null
>;

export function serializeTourney({
  id,
  ownerId,
  name,
  participants,
  matchResults,
  created,
  modified,
}: RichDbTourney): ApiTourney {
  return {
    id,
    ownerId,
    name,
    participants: participants.map(serializeParticipant),
    matchResults: matchResults.map(serializeMatchResult),
    created: created.toISOString(),
    modified: modified.toISOString(),
  };
}

export function serializeParticipant({
  id,
  name,
}: DbParticipant): ApiParticipant {
  return {
    id,
    name,
  };
}

export function serializeMatchResult({
  id,
  winnerId,
  loserId,
}: DbMatchResult): ApiMatchResult {
  return { id, winner: winnerId, loser: loserId };
}
