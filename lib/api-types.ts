import { JSONSchemaType } from "ajv";

const NAME_REGEX = /^(?! )[ -~]{1,64}(?<! )$/;
export const NAME_PATTERN = pattern(NAME_REGEX);
const NAME_SCHEMA = { type: "string", pattern: NAME_REGEX.source } as const;

const ID_REGEX = /^c[a-z0-9]{0,63}$/;
export const ID_PATTERN = pattern(ID_REGEX);
const ID_SCHEMA = { type: "string", pattern: ID_REGEX.source } as const;

function pattern(regex: RegExp): string {
  return regex.source.replace(/^\^/, "^ *").replace(/\$$/, " *$");
}

export interface Tourney {
  id: string;
  ownerId: string;
  name: string;
  participants: Participant[];
  matchResults: MatchResult[];
  created: string;
  modified: string;
}

export interface Participant {
  id: string;
  name: string;
}

export interface MatchResult {
  id: string;
  winner: string;
  loser: string;
}

export interface GetTourneyResponse extends Tourney {}

export interface MyTourneysResponse {
  tourneys: Tourney[] | null;
}

export interface CreateTourneyRequest {
  name: string;
}

export const CREATE_TOURNEY_REQUEST_SCHEMA: JSONSchemaType<CreateTourneyRequest> =
  {
    type: "object",
    required: ["name"],
    properties: {
      name: NAME_SCHEMA,
    },
  };

export interface CreateTourneyResponse extends Tourney {}

export interface UpdateTourneyRequest {
  name: string;
}

export const UPDATE_TOURNEY_REQUEST_SCHEMA: JSONSchemaType<UpdateTourneyRequest> =
  {
    type: "object",
    required: ["name"],
    properties: {
      name: NAME_SCHEMA,
    },
  };

export interface UpdateTourneyResponse extends Tourney {}

export interface DeleteTourneyRequest {}

export const DELETE_TOURNEY_REQUEST_SCHEMA: JSONSchemaType<DeleteTourneyRequest> =
  { type: "object" };

export interface DeleteTourneyResponse {}

export interface CreateParticipantRequest {
  name: string;
}

export const CREATE_PARTICIPANT_REQUEST_SCHEMA: JSONSchemaType<CreateParticipantRequest> =
  {
    type: "object",
    required: ["name"],
    properties: {
      name: NAME_SCHEMA,
    },
  };

export interface CreateParticipantResponse {
  tourney: Tourney;
  participant: Participant;
}

export interface UpdateParticipantRequest {
  name: string;
}

export const UPDATE_PARTICIPANT_REQUEST_SCHEMA: JSONSchemaType<UpdateParticipantRequest> =
  {
    type: "object",
    required: ["name"],
    properties: {
      name: NAME_SCHEMA,
    },
  };

export interface UpdateParticipantResponse {
  tourney: Tourney;
  participant: Participant;
}

export interface MoveParticipantRequest {
  indexDelta: number;
}

export const MOVE_PARTICIPANT_REQUEST_SCHEMA: JSONSchemaType<MoveParticipantRequest> =
  {
    type: "object",
    required: ["indexDelta"],
    properties: {
      indexDelta: { type: "integer" },
    },
  };

export interface MoveParticipantResponse {
  tourney: Tourney;
  participant: Participant;
}

export interface DeleteParticipantRequest {}

export const DELETE_PARTICIPANT_REQUEST_SCHEMA: JSONSchemaType<DeleteParticipantRequest> =
  {
    type: "object",
  };

export interface DeleteParticipantResponse {
  tourney: Tourney;
}

export interface CreateMatchResultRequest {
  winner: string;
  loser: string;
}

export const CREATE_MATCH_RESULT_REQUEST_SCHEMA: JSONSchemaType<CreateMatchResultRequest> =
  {
    type: "object",
    required: ["winner", "loser"],
    properties: {
      winner: ID_SCHEMA,
      loser: ID_SCHEMA,
    },
  };

export interface CreateMatchResultResponse {
  tourney: Tourney;
  matchResult: MatchResult;
}

export interface UpdateMatchResultRequest {
  winner: string;
  loser: string;
}

export const UPDATE_MATCH_RESULT_REQUEST_SCHEMA: JSONSchemaType<UpdateMatchResultRequest> =
  {
    type: "object",
    required: ["winner", "loser"],
    properties: {
      winner: ID_SCHEMA,
      loser: ID_SCHEMA,
    },
  };

export interface UpdateMatchResultResponse {
  tourney: Tourney;
  matchResult: MatchResult;
}

export interface DeleteMatchResultRequest {}

export const DELETE_MATCH_RESULT_REQUEST_SCHEMA: JSONSchemaType<DeleteMatchResultRequest> =
  {
    type: "object",
  };

export interface DeleteMatchResultResponse {
  tourney: Tourney;
}
