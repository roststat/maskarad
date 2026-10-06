import { NextResponse } from "next/server";

export const runtime = "nodejs";

const briefSchema = {
  type: "object",
  additionalProperties: false,
  required: ["brief"],
  properties: {
    brief: { type: "string" }
  }
};

const defaultOpenAiBaseUrl = "https://api.openai.com/v1";

function openAiUrl(path: string) {
  const baseUrl = (process.env.OPENAI_BASE_URL || defaultOpenAiBaseUrl).trim().replace(/\/+$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "assistant_not_configured" }, { status: 503 });
  }

  let wish = "";
  try {
    wish = String((await request.json()).wish || "").trim().slice(0, 2500);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (wish.length < 12) {
    return NextResponse.json({ ok: false, error: "wish_too_short" }, { status: 400 });
  }

  try {
    const response = await fetch(openAiUrl("/responses"), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_BRIEF_MODEL || "gpt-5",
        reasoning: { effort: "minimal" },
        instructions:
          "Ты помощник театра праздника «Маскарад». Аккуратно перепиши рассказ клиента на русском: убери повторы и слова-паразиты, сохрани его смысл и все названные факты. Ничего не придумывай, не задавай вопросов, не указывай, что нужно уточнить, и не добавляй сведения, которых не было в рассказе. Не делай анкету, списки, заголовки или категории. Результат — короткий живой текст из двух-четырёх абзацев, готовый к отправке театру.",
        input: wish,
        max_output_tokens: 1000,
        text: { format: { type: "json_schema", name: "party_brief", strict: true, schema: briefSchema } }
      }),
      cache: "no-store"
    });

    if (!response.ok) return NextResponse.json({ ok: false, error: "assistant_unavailable" }, { status: 502 });

    const data = (await response.json()) as { output_text?: string; output?: { content?: { type?: string; text?: string }[] }[] };
    const outputText = data.output_text ?? data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
    const parsed = outputText ? (JSON.parse(outputText) as { brief?: string }) : null;

    if (!parsed?.brief) return NextResponse.json({ ok: false, error: "assistant_invalid_response" }, { status: 502 });
    return NextResponse.json({ ok: true, brief: parsed.brief });
  } catch {
    return NextResponse.json({ ok: false, error: "assistant_unavailable" }, { status: 502 });
  }
}
