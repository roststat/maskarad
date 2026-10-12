import { randomUUID } from "node:crypto";
import { sendLeadToMax } from "../../app/api/leads/max.ts";

const result = await sendLeadToMax({
  id: randomUUID(),
  name: "Синтетическая проверка",
  phone: "+7 000 000-00-00",
  message: "Тест доставки без персональных данных. Канал заявок сайта подключён к закрытой группе MAX.",
  page: "/test",
  createdAt: new Date().toISOString()
});

if (result.status !== "sent") {
  console.error(`Тестовое сообщение не доставлено: ${result.status === "failed" ? result.reason : "канал отключён"}.`);
  process.exit(1);
}

console.log("Синтетическое сообщение доставлено в группу MAX.");
