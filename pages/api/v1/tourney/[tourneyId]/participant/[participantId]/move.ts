import {
  MoveParticipantRequest,
  MoveParticipantResponse,
  MOVE_PARTICIPANT_REQUEST_SCHEMA,
} from "../../../../../../../lib/api-types";
import {
  serializeParticipant,
  serializeTourney,
} from "../../../../../../../lib/server/conversions";
import {
  fetchParticipant,
  fetchTourney,
  moveOwnedParticipant,
  transaction,
} from "../../../../../../../lib/server/db";
import {
  ForbiddenException,
  NotFoundException,
  postAuthed,
} from "../../../../../../../lib/server/route";
import { castString } from "../../../../../../../lib/util";

export default postAuthed<MoveParticipantRequest, MoveParticipantResponse>(
  MOVE_PARTICIPANT_REQUEST_SCHEMA,
  ({ user, data: { indexDelta }, req }) =>
    transaction(async (db) => {
      const tourneyId = castString(req.query.tourneyId);
      const participantId = castString(req.query.participantId);

      const moved = await moveOwnedParticipant(
        db,
        tourneyId,
        participantId,
        user.id,
        { indexDelta }
      );

      const participant = await fetchParticipant(db, tourneyId, participantId);

      if (moved) {
        const tourney = await fetchTourney(db, tourneyId);

        return {
          tourney: serializeTourney(tourney!!),
          participant: serializeParticipant(participant!!),
        };
      } else if (participant === null) {
        throw new NotFoundException();
      } else {
        throw new ForbiddenException();
      }
    })
);
