type MaxLead = {
  id: string;
  name: string;
  phone: string;
  message: string;
  page: string;
  createdAt: string;
};

type MaxDelivery =
  | { status: "disabled" }
  | { status: "sent"; messageId?: string }
  | { status: "failed"; reason: "invalid_config" | "request_failed" };

type MaxOptions = {
  fetchImpl?: typeof fetch;
  env?: NodeJS.ProcessEnv;
};

export async function sendLeadToMax(
  lead: MaxLead,
  options: MaxOptions = {}
): Promise<MaxDelivery> {
  const env = options.env ?? process.env;
  const token = env.MAX_BOT_TOKEN?.trim();
  const chatId = env.MAX_CHAT_ID?.trim();
  const userId = env.MAX_USER_ID?.trim();

  if (!token && !chatId && !userId) return { status: "disabled" };
  if (!isValidToken(token) || !hasOneValidRecipient(chatId, userId)) {
    return { status: "failed", reason: "invalid_config" };
  }

  const query = new URLSearchParams({
    disable_link_preview: "true",
    ...(chatId ? { chat_id: chatId } : { user_id: userId as string })
  });

  try {
    const response = await (options.fetchImpl ?? fetch)(
      `https://platform-api2.max.ru/messages?${query}`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: formatMaxLead(lead), notify: true }),
        signal: AbortSignal.timeout(8000)
      }
    );
    const result = await response.json() as { message?: { body?: { mid?: string } } };
    if (!response.ok || !result.message) {
      return { status: "failed", reason: "request_failed" };
    }
    return { status: "sent", messageId: result.message.body?.mid };
  } catch {
    return { status: "failed", reason: "request_failed" };
  }
}

export function formatMaxLead(lead: MaxLead) {
  const name = lead.name || "Не указано";
  const message = lead.message || "Без дополнительных пожеланий";
  const pageUrl = `https://maskarad-teatr.ru${lead.page}`;
  const text = [
    "🎭 Новая заявка с сайта",
    "",
    `Имя: ${name}`,
    `Телефон: ${lead.phone}`,
    `Страница: ${pageUrl}`,
    `Время: ${lead.createdAt}`,
    `ID: ${lead.id}`,
    "",
    "Запрос:",
    message
  ].join("\n");
  return text.slice(0, 4000);
}

function isValidToken(value: string | undefined): value is string {
  return Boolean(value && /^\S{20,}$/.test(value));
}

function hasOneValidRecipient(chatId: string | undefined, userId: string | undefined) {
  if (Boolean(chatId) === Boolean(userId)) return false;
  return /^-?\d+$/.test(chatId || userId || "");
}
