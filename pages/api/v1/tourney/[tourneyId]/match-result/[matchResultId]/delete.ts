import {
  DeleteMatchResultRequest,
  DeleteMatchResultResponse,
  DELETE_MATCH_RESULT_REQUEST_SCHEMA,
} from "../../../../../../../lib/api-types";
import { serializeTourney } from "../../../../../../../lib/server/conversions";
import {
  deleteOwnedMatchResult,
  fetchMatchResult,
  fetchTourney,
  transaction,
} from "../../../../../../../lib/server/db";
import {
  ForbiddenException,
  NotFoundException,
  postAuthed,
} from "../../../../../../../lib/server/route";
import { castString } from "../../../../../../../lib/util";

export default postAuthed<DeleteMatchResultRequest, DeleteMatchResultResponse>(
  DELETE_MATCH_RESULT_REQUEST_SCHEMA,
  ({ user, req }) =>
    transaction(async (db) => {
      const tourneyId = castString(req.query.tourneyId);
      const matchResultId = castString(req.query.matchResultId);

      const deleted = await deleteOwnedMatchResult(
        db,
        tourneyId,
        matchResultId,
        user.id
      );

      if (deleted) {
        const tourney = await fetchTourney(db, tourneyId);
        return { tourney: serializeTourney(tourney!!) };
      } else {
        const matchResult = await fetchMatchResult(
          db,
          tourneyId,
          matchResultId
        );

        if (matchResult === null) {
          throw new NotFoundException();
        } else {
          throw new ForbiddenException();
        }
      }
    })
);
