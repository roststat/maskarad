const token = process.env.MAX_BOT_TOKEN?.trim();

if (!token) {
  console.error("Не задан MAX_BOT_TOKEN.");
  process.exit(1);
}

const url = new URL("https://platform-api2.max.ru/updates");
url.searchParams.set("limit", "20");
url.searchParams.set("timeout", "0");
url.searchParams.set("types", "bot_added,message_created");

let response;

try {
  response = await fetch(url, {
    headers: { Authorization: token },
    signal: AbortSignal.timeout(10_000)
  });
} catch {
  console.error("Не удалось связаться с MAX. Проверьте интернет и доверенный сертификат Минцифры.");
  process.exit(1);
}

if (!response.ok) {
  if (response.status === 401) {
    console.error("MAX отклонил токен. Скопируйте актуальный токен бота и повторите попытку.");
  } else {
    console.error(`MAX вернул ошибку HTTP ${response.status}.`);
  }
  process.exit(1);
}

let payload;

try {
  payload = await response.json();
} catch {
  console.error("MAX вернул ответ в неожиданном формате.");
  process.exit(1);
}

const updates = Array.isArray(payload?.updates) ? payload.updates : [];
const chatIds = new Set();

function collectChatIds(value) {
  if (!value || typeof value !== "object") return;

  if ("chat_id" in value && /^-?\d+$/.test(String(value.chat_id))) {
    chatIds.add(String(value.chat_id));
  }

  for (const nested of Object.values(value)) collectChatIds(nested);
}

for (const update of updates) collectChatIds(update);

if (chatIds.size === 0) {
  console.error(
    "ID группы не найден. Добавьте бота в нужную группу администратором, отправьте в группе сообщение и сразу повторите запуск."
  );
  process.exit(2);
}

console.log("Найдены ID групп/чатов:");
for (const chatId of chatIds) console.log(chatId);
console.log("Используйте нужное значение как MAX_CHAT_ID.");
