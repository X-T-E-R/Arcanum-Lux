export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    code?: string;
    message?: string;
  };
}

interface ModelListResponse {
  data?: Array<{
    id?: string;
  }>;
  error?: {
    code?: string;
    message?: string;
  };
}

const ORACLE_DEBUG = true;

function chatCompletionUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/chat/completions")) return trimmed;
  return `${trimmed}/chat/completions`;
}

function modelsUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/chat/completions")) {
    return trimmed.replace(/\/chat\/completions$/, "/models");
  }
  return `${trimmed}/models`;
}

function redactedBearer(apiKey: string): string {
  return apiKey ? `Bearer <redacted:${apiKey.length}>` : "Bearer <empty>";
}

function trimMessage(message?: string): string {
  return message ? message.replace(/\s+/g, " ").trim().slice(0, 160) : "";
}

function apiErrorText(
  status: number,
  payload?: { error?: { code?: string; message?: string } },
): string {
  const code = payload?.error?.code?.toUpperCase() ?? `HTTP_${status}`;
  const message = trimMessage(payload?.error?.message);
  return message ? `${code}: ${message}` : code;
}

function logOracleDebug(label: string, payload: Record<string, unknown>): void {
  if (!ORACLE_DEBUG) return;
  console.info(`[oracle:debug] ${label}`, payload);
}

function logOracleError(
  label: string,
  context: Record<string, unknown>,
  error?: unknown,
): void {
  console.error(`[oracle] ${label}`, {
    ...context,
    error,
  });
}

async function readJsonPayload<T>(
  response: Response,
  label: string,
  context: Record<string, unknown>,
): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch (error) {
    logOracleError(`${label} payload parse failed`, context, error);
    return {} as T;
  }
}

export async function completeChat(
  config: ChatConfig,
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> {
  const url = chatCompletionUrl(config.baseUrl);
  const body = {
    model: config.model,
    messages,
    temperature: 0.9,
    max_tokens: 4096,
    stream: false,
  };
  logOracleDebug("chat raw request", {
    method: "POST",
    url,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: redactedBearer(config.apiKey),
    },
    body,
  });
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    logOracleError("chat fetch failed", { method: "POST", url, model: config.model }, error);
    throw error;
  }

  const payload = await readJsonPayload<ChatCompletionResponse>(res, "chat", {
    method: "POST",
    url,
    status: res.status,
    statusText: res.statusText,
  });
  if (!res.ok) {
    logOracleError("chat http error", {
      method: "POST",
      url,
      model: config.model,
      status: res.status,
      statusText: res.statusText,
      payload,
    });
    throw new Error(apiErrorText(res.status, payload));
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("NO_CONTENT");
  return content;
}

export async function listModels(config: ChatConfig, signal?: AbortSignal): Promise<string[]> {
  const url = modelsUrl(config.baseUrl);
  logOracleDebug("models raw request", {
    method: "GET",
    url,
    mode: "cors",
    headers: {
      Authorization: redactedBearer(config.apiKey),
    },
  });
  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      signal,
    });
  } catch (error) {
    logOracleError("models fetch failed", { method: "GET", url }, error);
    throw error;
  }

  const payload = await readJsonPayload<ModelListResponse>(res, "models", {
    method: "GET",
    url,
    status: res.status,
    statusText: res.statusText,
  });
  if (!res.ok) {
    logOracleError("models http error", {
      method: "GET",
      url,
      status: res.status,
      statusText: res.statusText,
      payload,
    });
    throw new Error(apiErrorText(res.status, payload));
  }

  return (payload.data ?? [])
    .map((item) => item.id)
    .filter((id): id is string => Boolean(id));
}
