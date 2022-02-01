import { GetTourneyResponse } from "../../../../../lib/api-types";
import { serializeTourney } from "../../../../../lib/server/conversions";
import { fetchTourney, transaction } from "../../../../../lib/server/db";
import { get, NotFoundException } from "../../../../../lib/server/route";
import { castString, error } from "../../../../../lib/util";

export default get<GetTourneyResponse>(({ req }) =>
  transaction(async (db) => {
    const id = castString(req.query.tourneyId);
    const tourney =
      (await fetchTourney(db, id)) ?? error(new NotFoundException());
    return serializeTourney(tourney);
  })
);
