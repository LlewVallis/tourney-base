import {
  CreateMatchResultRequest,
  CreateMatchResultResponse,
  CREATE_MATCH_RESULT_REQUEST_SCHEMA,
} from "../../../../../../lib/api-types";
import { MAX_TOURNEY_MATCH_RESULTS } from "../../../../../../lib/limits";
import {
  serializeMatchResult,
  serializeTourney,
} from "../../../../../../lib/server/conversions";
import {
  createMatchResult,
  fetchParticipant,
  fetchTourney,
  transaction,
} from "../../../../../../lib/server/db";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  postAuthed,
  ResourceLimitException,
} from "../../../../../../lib/server/route";
import { castString } from "../../../../../../lib/util";

export default postAuthed<CreateMatchResultRequest, CreateMatchResultResponse>(
  CREATE_MATCH_RESULT_REQUEST_SCHEMA,
  ({ user, req, data: { winner: winnerId, loser: loserId } }) =>
    transaction(async (db) => {
      const tourneyId = castString(req.query.tourneyId);

      if (winnerId === loserId) {
        throw new BadRequestException();
      }

      const tourney = await fetchTourney(db, tourneyId);
      const winner = await fetchParticipant(db, tourneyId, winnerId);
      const loser = await fetchParticipant(db, tourneyId, loserId);

      if (tourney === null) {
        throw new NotFoundException();
      }

      if (winner === null || loser === null) {
        throw new BadRequestException();
      }

      if (tourney.ownerId !== user.id) {
        throw new ForbiddenException();
      }

      if (tourney.matchResults.length >= MAX_TOURNEY_MATCH_RESULTS) {
        throw new ResourceLimitException();
      }

      const result = await createMatchResult(db, tourneyId, {
        winnerId,
        loserId,
      });

      const newTourney = await fetchTourney(db, tourneyId);

      return {
        tourney: serializeTourney(newTourney!!),
        matchResult: serializeMatchResult(result),
      };
    })
);
