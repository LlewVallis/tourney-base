import {
  CreateParticipantRequest,
  CreateParticipantResponse,
  CREATE_PARTICIPANT_REQUEST_SCHEMA,
} from "../../../../../../lib/api-types";
import { MAX_TOURNEY_PARTICIPANTS } from "../../../../../../lib/limits";
import {
  serializeParticipant,
  serializeTourney,
} from "../../../../../../lib/server/conversions";
import {
  createParticipant,
  fetchTourney,
  transaction,
} from "../../../../../../lib/server/db";
import {
  ForbiddenException,
  NotFoundException,
  postAuthed,
  ResourceLimitException,
} from "../../../../../../lib/server/route";
import { castString } from "../../../../../../lib/util";

export default postAuthed<CreateParticipantRequest, CreateParticipantResponse>(
  CREATE_PARTICIPANT_REQUEST_SCHEMA,
  ({ user, data: { name }, req }) =>
    transaction(async (db) => {
      const tourneyId = castString(req.query.tourneyId);

      const tourney = await fetchTourney(db, tourneyId);
      if (tourney === null) {
        throw new NotFoundException();
      }

      if (tourney.ownerId !== user.id) {
        throw new ForbiddenException();
      }

      if (tourney.participants.length >= MAX_TOURNEY_PARTICIPANTS) {
        throw new ResourceLimitException();
      }

      const participant = await createParticipant(db, tourneyId, { name });
      const newTourney = await fetchTourney(db, tourneyId);

      return {
        tourney: serializeTourney(newTourney!!),
        participant: serializeParticipant(participant),
      };
    })
);
