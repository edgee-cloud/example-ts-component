import {
  Fields,
  IncomingRequest,
  ResponseOutparam,
} from "wasi:http/types@0.2.0";

import {
  buildResponseHtml,
  parseBody,
  ParsedHeaders,
  parseHeaders,
} from "./helpers";

const index = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Coming Soon</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100vh;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 400px;
      padding: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    footer {
      font-size: 0.9rem;
      color: #888;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Coming Soon</h1>
    <p>We're working hard to launch something awesome. Stay tuned!</p>
    <footer>Served by <a href="https://www.edgee.cloud">Edgee</a></footer>
  </div>
</body>
</html>
`;

function handle(req: IncomingRequest, resp: ResponseOutparam) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const settings = Settings.fromHeaders(req.headers());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = parseBody(req);
    const response = buildResponseHtml(index, 200);
    response.send(resp);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    const response = buildResponseHtml(index, 200);
    response.send(resp);
  }
}

export const incomingHandler = {
  handle,
};

export class Settings {
  public example = "default";
  constructor(example: string) {
    this.example = example;
  }

  public static fromHeaders(headers: Fields) {
    const settings = Settings.new(parseHeaders(headers));
    return settings;
  }

  public static new(headers: ParsedHeaders) {
    const settings = headers["x-edgee-component-settings"];
    if (settings.length !== 1) {
      throw new Error(
        "Expected exactly one 'x-edgee-component-settings' header"
      );
    }
    const setting = settings[0];
    const parsedSetting: Record<string, string> = JSON.parse(setting);
    return new Settings(parsedSetting["example"] ?? "");
  }
}
