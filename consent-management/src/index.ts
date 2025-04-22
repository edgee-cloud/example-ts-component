import type {
  consentManagement as EdgeeConsentManagement,
} from "../types/wit";


const convertDict = (dict: EdgeeConsentManagement.Dict): Map<string, string> => {
  const data = new Map<string, string>();

  for (const [key, value] of dict) {
    data.set(key, value);
  }

  return data;
};

export const consentManagement: typeof EdgeeConsentManagement = {
  map(cookies: EdgeeConsentManagement.Dict, settings: EdgeeConsentManagement.Dict) {
    const dictSettings = convertDict(settings);
    const dictCookies = convertDict(cookies);

    if (!dictCookies.has('example')) {
        return;
    }
    const example = dictCookies.get('example');
    if (example === "granted") {
        return "granted";
    } else if (example === "denied") {
        return "denied";
    }
    return "pending";
  },
};
