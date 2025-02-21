import { assert } from "chai";
import { describe, it } from "mocha";
import { dataCollection} from '../src/index';
import { EdgeeRequest, Dict, Event } from "../types/interfaces/edgee-components-data-collection";

describe('data collection component', function () {

  const samplePageEvent: Event = {
    uuid: "abc",
    timestamp: 123n,
    timestampMillis: 123n,
    timestampMicros: 123n,
    eventType: "page",
    data: {
      tag: 'page',
      val: {
        name: "page name",
        category: "category",
        keywords: ["keyword1", "keyword2"],
        title: "page title",
        url: "https://mywebsite.com/path?ok=1",
        path: "/path",
        search: "?ok=1",
        referrer: "https://anotherwebsite.com/source",
        properties: [],
      },
    },
    consent: "granted",
    context: {
      page: {
        name: "page name",
        category: "category",
        keywords: ["keyword1", "keyword2"],
        title: "page title",
        url: "https://mywebsite.com/path?ok=1",
        path: "/path",
        search: "?ok=1",
        referrer: "https://anotherwebsite.com/source",
        properties: [],
      },
      client: {
        ip: "111.111.111.111",
        locale: "EN",
        timezone: "CET",
        continent: "Europe",
        countryCode: "FR",
        countryName: "France",
        region: "Europe",
        city: "Paris",
        userAgent: "Chrome",
        userAgentArchitecture: "ABC",
        userAgentBitness: "64",
        userAgentFullVersionList: "ABC",
        userAgentMobile: "ABC",
        userAgentModel: "ABC",
        userAgentVersionList: "ABC",
        osName: "MacOs",
        osVersion: "42",
        screenWidth: 1024,
        screenHeight: 768,
        screenDensity: 1,
      },
      campaign: {
        name: "Campaign",
        source: "Google",
        medium: "blog",
        term: "abc",
        content: "abc",
        creativeFormat: "abc",
        marketingTactic: "abc",
      },
      user: {
        userId: "abc",
        anonymousId: "def",
        edgeeId: "123abc",
        properties: [],
      },
      session: {
        sessionId: "42",
        previousSessionId: "qwerty",
        sessionCount: 1,
        sessionStart: false,
        firstSeen: 123n,
        lastSeen: 123n,
      },
    },
  };

  const sampleSettings: Dict = [
    ["example", "api_value"]
  ];

  describe('#page()', function () {
    it('should return an EdgeeRequest object', function () {
      const req: EdgeeRequest = dataCollection.page(samplePageEvent, sampleSettings);
      assert.equal(req.method, "POST");
      assert.equal(req.url, "https://your-endpoint.com/path");
      assert.equal(req.headers.length, 2);
      assert.equal(req.body, '{"sessionId":42,"pageTitle":"page title"}');
    });
  });

});
