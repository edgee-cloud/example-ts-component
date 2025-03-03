import type {
  dataCollection as EdgeeDataCollection,
} from "../types/wit.d.ts";

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

const convertDict = (dict: EdgeeDataCollection.Dict): Map<string, string> => {
  const data = new Map<string, string>();

  for (const [key, value] of dict) {
    data.set(key, value);
  }

  return data;
};

const buildEdgeeRequest = (payload: JSONObject, apiKey: string): EdgeeDataCollection.EdgeeRequest => ({
  method: 'POST',
  url: API_ENDPOINT,
  headers: [
    ['Content-Type', 'application/json'],
    ["Authorization", `Bearer ${apiKey}`],
  ],
  body: JSON.stringify(payload),
  forwardClientHeaders: true,
});

const buildPagePayload = (data: EdgeeDataCollection.PageData, context: EdgeeDataCollection.Context): JSONObject => {
  const sessionId = parseInt(context.session.sessionId);
  const pageTitle = data.title;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    pageTitle,
  };
};

const buildTrackPayload = (data: EdgeeDataCollection.TrackData, context: EdgeeDataCollection.Context): JSONObject => {
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

const buildUserPayload = (data: EdgeeDataCollection.UserData, context: EdgeeDataCollection.Context): JSONObject => {
  const sessionId = parseInt(context.session.sessionId);
  const userId = data.userId;
  // TODO extract data/context fields and build payload object
  return {
    sessionId,
    userId,
  };
};

export const dataCollection: typeof EdgeeDataCollection = {

  page(e: EdgeeDataCollection.Event, settings: EdgeeDataCollection.Dict) {
    if (e.data.tag != 'page') {
      throw new Error("Missing page data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('example');
    if (!apiKey) throw new Error("Missing API key");

    // build payload
    const payload = buildPagePayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },

  track(e: EdgeeDataCollection.Event, settings: EdgeeDataCollection.Dict) {
    if (e.data.tag != 'track') {
      throw new Error("Missing track data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('example');
    if (!apiKey) throw new Error("Missing API key");
    

    // build payload
    const payload = buildTrackPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },

  user(e: EdgeeDataCollection.Event, settings: EdgeeDataCollection.Dict) {
    if (e.data.tag != 'user') {
      throw new Error("Missing user data");
    }

    // convert to native object
    const dictSettings = convertDict(settings);
    const apiKey = dictSettings.get('example');
    if (!apiKey) throw new Error("Missing API key");

    // build payload
    const payload = buildUserPayload(e.data.val, e.context);

    // build and return EdgeeRequest
    return buildEdgeeRequest(payload, apiKey);
  },
};
