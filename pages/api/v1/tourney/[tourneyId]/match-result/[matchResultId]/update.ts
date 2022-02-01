import {
  UpdateMatchResultRequest,
  UpdateMatchResultResponse,
  UPDATE_MATCH_RESULT_REQUEST_SCHEMA,
} from "../../../../../../../lib/api-types";
import {
  serializeMatchResult,
  serializeTourney,
} from "../../../../../../../lib/server/conversions";
import {
  fetchMatchResult,
  fetchTourney,
  transaction,
  updateOwnedMatchResult,
} from "../../../../../../../lib/server/db";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  postAuthed,
} from "../../../../../../../lib/server/route";
import { castString } from "../../../../../../../lib/util";

export default postAuthed<UpdateMatchResultRequest, UpdateMatchResultResponse>(
  UPDATE_MATCH_RESULT_REQUEST_SCHEMA,
  ({ user, data: { winner: winnerId, loser: loserId }, req }) =>
    transaction(async (db) => {
      const tourneyId = castString(req.query.tourneyId);
      const matchResultId = castString(req.query.matchResultId);

      if (winnerId === loserId) {
        throw new BadRequestException();
      }

      const updated = await updateOwnedMatchResult(
        db,
        tourneyId,
        matchResultId,
        user.id,
        { winnerId, loserId }
      );

      const matchResult = await fetchMatchResult(db, tourneyId, matchResultId);

      if (updated) {
        const tourney = await fetchTourney(db, tourneyId);

        return {
          tourney: serializeTourney(tourney!!),
          matchResult: serializeMatchResult(matchResult!!),
        };
      } else {
        if (matchResult === null) {
          throw new NotFoundException();
        } else {
          throw new ForbiddenException();
        }
      }
    })
);
