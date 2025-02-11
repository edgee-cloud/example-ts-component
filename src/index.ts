import {
  EdgeeProtocolsDataCollection,
  EdgeeRequest,
  Dict,
  Event,
  PageData,
  TrackData,
  UserData,
  Context
} from "../types/interfaces/edgee-protocols-data-collection";

const API_ENDPOINT = "https://your-endpoint.com/path";

type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray
    | Map<string, string>;

interface JSONObject {
    [x: string]: JSONValue;
}

type JSONArray = JSONValue[];

const convertDict = (dict: Dict): Map<string, string> => {
  const data = new Map<string, string>();

  for (const [key, value] of dict) {
    data.set(key, value);
  }

  return data;
};

const buildEdgeeRequest = (payload: JSONObject, apiKey: string): EdgeeRequest => ({
  method: 'POST',
  url: API_ENDPOINT,
  headers: [
    ['Content-Type', 'application/json'],
    ["Authorization", `Bearer ${apiKey}`],
  ],
  body: JSON.stringify(payload),
  forwardClientHeaders: true,
});

const buildPagePayload = (data: PageData, context: Context): JSONObject => {
  const sessionId = parseInt(context.session.sessionId);
  const pageTitle = data.title;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    pageTitle,
  };
};

const buildTrackPayload = (data: TrackData, context: Context): JSONObject => {
  const sessionId = parseInt(context.session.sessionId);
  const eventName = data.name;
  const eventProperties = convertDict(data.properties);
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    eventName,
    eventProperties,
  };
};

const buildUserPayload = (data: UserData, context: Context): JSONObject => {
  const sessionId = parseInt(context.session.sessionId);
  const userId = data.userId;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    userId,
  };
};

export const dataCollection: typeof EdgeeProtocolsDataCollection = {

  page(e: Event, settings: Dict) {
    if (e.data.tag != 'page') {
      throw new Error("Missing page data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('your_api_key');
    if (!apiKey) throw new Error("Missing API key");

    // build payload
    const payload = buildPagePayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },

  track(e: Event, settings: Dict) {
    if (e.data.tag != 'track') {
      throw new Error("Missing track data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('your_api_key');
    if (!apiKey) throw new Error("Missing API key");
    

    // build payload
    const payload = buildTrackPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },

  user(e: Event, settings: Dict) {
    if (e.data.tag != 'user') {
      throw new Error("Missing user data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('your_api_key');
    if (!apiKey) throw new Error("Missing API key");

    // build payload
    const payload = buildUserPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },
};
