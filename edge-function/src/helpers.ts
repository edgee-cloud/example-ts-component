import {
  Fields,
  IncomingRequest,
  OutgoingBody,
  OutgoingResponse,
  ResponseOutparam,
} from "wasi:http/types@0.2.0";

interface ResponseBuilder {
  headers: Fields;
  statusCode: number;
  body: string | undefined;
  setHeader: (key: string, value: string) => void;
  setStatusCode: (statusCode: number) => void;
  setBody: (body: string) => void;
  send: (resp: ResponseOutparam) => void;
}

export type ParsedHeaders = Record<string, string[]>;

export function ReponseBuilder(): ResponseBuilder {
  return {
    headers: new Fields(),
    statusCode: 200,
    body: undefined,
    setHeader: function (key: string, value: string) {
      this.headers.set(key, [new TextEncoder().encode(value)]);
    },
    setStatusCode: function (statusCode: number) {
      this.statusCode = statusCode;
    },
    setBody: function (body: string) {
      this.body = body;
    },
    send: function (resp: ResponseOutparam) {
      const response = new OutgoingResponse(this.headers);
      response.setStatusCode(this.statusCode);
      const outgoingBody = response.body();
      {
        const outputStream = outgoingBody.write();
        outputStream.write(new Uint8Array(new TextEncoder().encode(this.body)));
        outputStream.flush();
        // @ts-ignore: need to drop the stream according to WASI spec
        outputStream[Symbol.dispose]();
      }

      OutgoingBody.finish(outgoingBody, undefined);
      ResponseOutparam.set(resp, { tag: "ok", val: response });
      return response;
    },
  };
}

export function parseHeaders(headers: Fields) {
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const output: ParsedHeaders = {};
  for (const [key, value] of headers.entries()) {
    const headerName = key;
    const headerValue = decoder.decode(value);
    if (headerValue) {
      if (!output[headerName]) {
        output[headerName] = [headerValue];
      } else {
        output[headerName].push(headerValue);
      }
    }
  }
  return output;
}

export function parseBody(req: IncomingRequest) {
  const requestBody: Uint8Array[] = [];
  const stream = req.consume();
  while (true) {
    try {
      const chunk = stream.stream().read(4096n);
      if (!chunk || chunk.length === 0) {
        break;
      }

      requestBody.push(chunk);
    } catch (e) {
      if ((e as any).payload.tag === "closed") {
        // Stream is closed, we can stop reading
        break;
      }
      throw new Error(`Failed to read from request stream: ${e}`);
    }
  }

  return requestBody;
}

export function buildResponse(
  body: string,
  statusCode: number,
  contentType: string
): ResponseBuilder {
  const builder: ResponseBuilder = ReponseBuilder();
  builder.setHeader("Content-Type", contentType);
  builder.setStatusCode(statusCode);
  builder.setBody(body);
  return builder;
}

export function buildResponseHtml(
  body: string,
  statusCode: number
): ResponseBuilder {
  const builder: ResponseBuilder = ReponseBuilder();
  builder.setHeader("Content-Type", "text/html; charset=utf-8");
  builder.setStatusCode(statusCode);
  builder.setBody(body);
  return builder;
}
