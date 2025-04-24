import { assert } from "chai";
import { describe, it } from "mocha";
import { consentManagement } from '../src/index';
import { Dict } from "../types/interfaces/edgee-components-consent-management";

describe('consent management component', function () {

  const sampleSettings: Dict = [
    ["example", "api_value"]
  ];

  const sampleCookies: Dict = [
    ["example", "denied"]
  ];

  describe('#map()', function () {
    it('should return consent denied', function () {
      const req = consentManagement.map(sampleCookies, sampleSettings);
      assert.equal(req, "denied");
    });
  });

});
